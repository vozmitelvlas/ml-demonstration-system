package ru.etu.mldemonstrationapp.mainservice.clients;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import ru.etu.mldemonstrationapp.mainservice.exception.ExternalServerClientError;
import ru.etu.mldemonstrationapp.mainservice.exception.ExternalServerResponseError;

import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Implementation of the OrthancRestClient
 */

@Slf4j
@RequiredArgsConstructor
public class OrthancRestClientImpl implements OrthancRestClient {
    private final RestClient restClient;

    /**
     * Upload DICOM instance to the Orthanc server. This implementation returns uploaded Series ID
     *
     * <p>Relevant Orthanc REST API endpoint:</p>
     *
     * <a href="https://orthanc.uclouvain.be/api/#tag/Instances/paths/~1instances/post">POST /instances</a> – Upload a DICOM file
     *
     * @param file DICOM or ZIP file to upload
     * @return ID of the uploaded DICOM series
     * @see OrthancUploadInstanceResponse
     */
    @Override
    public String uploadDicomInstance(Resource file) {
        try {
            String jsonBody = restClient.post()
                    .uri("/instances")
                    .body(file)
                    .retrieve()
                    .body(String.class);

            // Orthanc returns an array of objects when multiple DICOM instances are loaded, and a single object
            // when only one is loaded. Therefore, it is necessary to use ObjectMapper
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonBody);

            if (root.isArray()) { // Multiple instances case
                List<OrthancUploadInstanceResponse> instances = mapper
                        .readerForListOf(OrthancUploadInstanceResponse.class)
                        .readValue(root);

                if (instances.isEmpty()) {
                    log.warn("Orthanc returned an empty list of uploaded instances");
                    throw new ExternalServerClientError("Некорректный формат файла");
                }

                return instances.get(0).ParentSeries();
            }

            // One instance case
            return mapper.treeToValue(root, OrthancUploadInstanceResponse.class).ParentSeries();

        } catch (HttpClientErrorException.BadRequest e) {
            log.warn(e.getMessage());
            throw new ExternalServerClientError("Некорректный формат файла");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ExternalServerResponseError("Ошибка при отправке данных удаленному серверу");
        }
    }

    /**
     * Send uploaded DICOM resources to remote DICOM modality.
     * This implementation uses asynchronous job execution.
     *
     * <p>Relevant Orthanc REST API endpoint:</p>
     * <a href="https://orthanc.uclouvain.be/api/#tag/Networking/paths/~1modalities~1{id}~1store/post" target="_blank">
     * POST /modalities/{name}/store
     * </a> – Send DICOM resources to a remote modality
     *
     * @param modalityName name (AE Title) of the target remote DICOM modality
     * @param resources    list of sending resources IDs
     * @return ID of the Orthanc job
     */
    @Override
    public String sendInstanceToModality(String modalityName, List<String> resources) {
        try {
            OrthancStoreResponse response = restClient.post()
                    .uri("/modalities/{modalityName}/store", modalityName)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new OrthancStoreRequest(false, resources))
                    .retrieve()
                    .body(OrthancStoreResponse.class);

            if (Objects.isNull(response)) {
                log.error("OrthancStoreResponse body is null");
                throw new ExternalServerResponseError("Ошибка при отправке данных удаленному серверу");
            }
            return response.ID();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ExternalServerResponseError("Получен неожиданный ответ от удаленного сервера");
        }

    }


    @Override
    public OrthancJob getJob(String jobId) {
        try {
            return restClient.get()
                    .uri("/jobs/{jobId}", jobId)
                    .retrieve()
                    .body(OrthancJob.class);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ExternalServerResponseError("Получен неожиданный ответ от удаленного сервера");
        }
    }


    @Override
    public OrthancSeries getSeries(String seriesId, List<String> requestedTags) {
        try {
            return restClient.get()
                    .uri("/series/{seriesId}?requested-tags={requested-tags}", seriesId, String.join(";", requestedTags))
                    .retrieve()
                    .body(OrthancSeries.class);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ExternalServerResponseError("Получен неожиданный ответ от удаленного сервера");
        }
    }

    @Override
    public void deleteSeries(String seriesId) {
        try {
            restClient
                    .delete()
                    .uri("/series/{seriesId}", seriesId)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Override
    public Resource getZip(String seriesId) {
        try {
            Resource body = restClient
                    .get()
                    .uri("/series/{seriesId}/archive", seriesId)
                    .retrieve()
                    .body(Resource.class);

            if (Objects.isNull(body)) {
                log.error("Series zip is null");
                throw new ExternalServerResponseError("Не удалось получить данные от удаленного сервера");
            }

            return new InputStreamResource(body.getInputStream());
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ExternalServerResponseError("Не удалось получить данные от удаленного сервера");
        }
    }

    @Override
    public List<String> findResources(String level, Map<String, String> dicomTags) {
        var parameterizedTypeReference = new ParameterizedTypeReference<List<String>>() {
        };
        try {
            return restClient
                    .post()
                    .uri("/tools/find")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "Level", level,
                            "Query", dicomTags,
                            "Timeout", 10
                    ))
                    .retrieve()
                    .body(parameterizedTypeReference);
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());
            throw new ExternalServerResponseError("Получен неожиданный ответ от удаленного сервера");
        }

    }

    /**
     * @param ID            ID of the uploaded instance
     * @param ParentPatient ID of the parent patient to which the instance belongs
     * @param ParentSeries  ID of the parent series containing the uploaded instance
     * @param ParentStudy   ID of the parent study that contains the series
     * @param Path          the relative path within Orthanc's REST API to access the uploaded instance
     * @param Status        upload status
     */
    private record OrthancUploadInstanceResponse(String ID, String ParentPatient, String ParentSeries,
                                                 String ParentStudy, String Path, String Status) {
    }


    /**
     * Request for storing resources to a remote DICOM modality.
     *
     * @param Synchronous indicates whether the operation should block until completion
     * @param Resources   list of resource IDs to send
     */
    private record OrthancStoreRequest(boolean Synchronous, List<String> Resources) {
    }

    /**
     * Response after sending DICOM resources to a remote modality.
     *
     * @param ID   Orthanc job ID
     * @param Path the relative path within Orthanc's REST API to access the job
     */
    private record OrthancStoreResponse(String ID, String Path) {
    }


}
