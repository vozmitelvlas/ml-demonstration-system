package ru.etu.mldemonstrationapp.mainservice.clients.monai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.web.client.*;
import ru.etu.mldemonstrationapp.mainservice.exception.ExternalServerClientException;
import ru.etu.mldemonstrationapp.mainservice.exception.ExternalServerInternalException;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class WorkflowManagerClientImpl implements WorkflowManagerClient {
    private final RestClient restClient;

    @Override
    public WorkflowRegisterResponse registerWorkflow(Map<String, Object> workflowConfig) {
        try {
            return restClient.post()
                    .uri("/workflows")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(workflowConfig)
                    .retrieve()
                    .body(WorkflowRegisterResponse.class);

        } catch (HttpClientErrorException.BadRequest e) {
            if (e.getResponseBodyAsString().contains("already exists")) {
                throw  new ExternalServerClientException(String.format("Workflow с названием %s уже существует", workflowConfig.get("name")), e);
            }
            log.error("Incorrect workflow syntax: {}", StringUtils.normalizeSpace(e.getResponseBodyAsString()));
            throw new ExternalServerClientException("Некорректный workflow", e);
        } catch (HttpStatusCodeException e) {
            log.error("Error while creating a new workflow: {}", StringUtils.normalizeSpace(e.getResponseBodyAsString()));
            throw new ExternalServerInternalException("Ошибка в работе Workflow Manager");
        }
    }

    @Override
    public void deleteWorkflow(String workflowId) {
        try {
            restClient.delete()
                    .uri("/workflows/{workflowId}", workflowId)
                    .retrieve()
                    .toBodilessEntity();

        } catch (HttpClientErrorException.NotFound e) {
            log.error("Error while deleting workflow with ID {}: {}", workflowId, StringUtils.normalizeSpace(e.getResponseBodyAsString()));
            throw new ExternalServerClientException("Workflow не найден", e);
        } catch (HttpStatusCodeException e) {
            log.error("Workflow manager error while deleting workflow with ID %s {}: {}", workflowId, StringUtils.normalizeSpace(e.getResponseBodyAsString()));
            throw new ExternalServerInternalException("Ошибка в работе Workflow Manager", e);
        }

    }
}
