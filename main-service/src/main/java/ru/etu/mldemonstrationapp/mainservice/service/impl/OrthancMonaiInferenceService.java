package ru.etu.mldemonstrationapp.mainservice.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.clients.orthanc.OrthancRestClient;
import ru.etu.mldemonstrationapp.mainservice.configuration.inference.monaideploy.MonaiDeployProperties;
import ru.etu.mldemonstrationapp.mainservice.dto.InferRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelRuntime;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
import ru.etu.mldemonstrationapp.mainservice.entity.Task;
import ru.etu.mldemonstrationapp.mainservice.exception.ExternalServerResponseError;
import ru.etu.mldemonstrationapp.mainservice.service.ModelInferenceService;
import ru.etu.mldemonstrationapp.mainservice.service.TaskService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.concurrent.*;


/**
 * ModelInferenceServer implementation of that uses MONAI Deploy with Orthanc
 *
 * @see ModelInferenceService
 */
@Service
@Slf4j
@ConditionalOnBean(MonaiDeployProperties.class)
public class OrthancMonaiInferenceService implements ModelInferenceService {
    @Autowired
    private MonaiDeployProperties monaiDeployProperties;
    @Autowired
    private OrthancRestClient orthancRestClient;
    @Autowired
    private TaskService taskService;

    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(4);

    @Override
    public boolean supports(ModelVersion modelVersion) {
        return modelVersion.getRuntime() == ModelRuntime.MONAI_DEPLOY;
    }

    @Override
    @Async
    public void infer(InferRequest inferRequest, MultipartFile inputFile, UUID taskId) {
        try {
            Path inputFilePath = saveInputFile(inputFile);
            String orthancSeriesId = orthancRestClient.uploadDicomInstance(new FileSystemResource(inputFilePath));
            String jobId = orthancRestClient.sendInstanceToModality(monaiDeployProperties.getAeTitle(), Collections.singletonList(orthancSeriesId));
            waitForJobCompletion(jobId);
            String studyInstanceUIDTag = requestStudyInstanceUID(orthancSeriesId);

            // Find DICOM series produced by MONAI model
            String resultSeriesId = waitForModelResult(studyInstanceUIDTag);
            Path resultFilePath = saveResultFile(resultSeriesId, taskId);
            taskService.markSuccess(taskId, resultFilePath.toAbsolutePath().toString());

            // Clearing
            orthancRestClient.deleteSeries(resultSeriesId);
            executorService.schedule(() -> clearArtifacts(inputFilePath, resultFilePath), monaiDeployProperties.getResultStoringTimeMinutes(), TimeUnit.MINUTES);

        } catch (Exception e) {
            log.error(e.getMessage());
            taskService.markFailed(taskId, e.getMessage());
        }
    }


    public ResponseEntity<?> getInferenceResult(Task task) {
        if (Objects.isNull(task.getOutputPath())) {
            throw new NoSuchElementException("Результат задачи %s недоступен".formatted(task.getTaskId()));
        }

        try {
            var resource = new InputStreamResource(Files.newInputStream(Path.of(task.getOutputPath())));
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(task.getOutputPath()).build().toString())
                    .body(resource);
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка при загрузке файла результата");
        }
    }


    private Path saveResultFile(String resultSeriesId, UUID taskId) {
        Resource resource = orthancRestClient.getZip(resultSeriesId);
        try (InputStream inputStream = resource.getInputStream()) {
            Path resultFilePath = Files.createTempFile("result-", "-" + taskId.toString() + ".zip");
            Files.copy(inputStream, resultFilePath, StandardCopyOption.REPLACE_EXISTING);
            return resultFilePath;
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new ExternalServerResponseError("Ошибка при сохранении результата инференса");
        }
    }

    private void clearArtifacts(Path inputFile, Path resultFile) {
        try {
            Files.deleteIfExists(inputFile);
            Files.deleteIfExists(resultFile);
        } catch (IOException e) {
            log.error("Error while clearing artifacts: {}", e.getMessage());
        }
    }


    private Path saveInputFile(MultipartFile inputFile) throws IOException {
        if (inputFile == null || inputFile.isEmpty()) {
            throw new IOException("Файл данных пуст");
        }

        try {
            Path filePath = Files.createTempFile("upload-", "-" + inputFile.getOriginalFilename());
            Files.copy(inputFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return filePath;
        } catch (IOException e) {
            log.error("Error while saving input file {}", e.getMessage());
            throw e;
        }
    }


    private String requestStudyInstanceUID(String orthancSeriesId) {
        List<String> requestedTags = List.of("0020,000d");
        OrthancRestClient.OrthancSeries series = orthancRestClient.getSeries(orthancSeriesId, requestedTags);
        return Optional.ofNullable(series.RequestedTags().get("StudyInstanceUID"))
                .orElseThrow(() -> {
                    log.error("Not found StudyInstanceUID tag in Orthanc Series details");
                    return new ExternalServerResponseError("Получен неожиданный ответ от удаленного сервера.");
                });

    }

    private String waitForModelResult(String studyInstanceUID) {
        return pollForModelResult(studyInstanceUID).orTimeout(monaiDeployProperties.getPacs().getInferenceTaskTimeoutSeconds(), TimeUnit.SECONDS).join();
    }

    private CompletableFuture<String> pollForModelResult(String studyInstanceUID) {
        CompletableFuture<String> resultFuture = new CompletableFuture<>();

        ScheduledFuture<?> pollingTask = executorService.scheduleAtFixedRate(() -> {
            try {
                List<String> resources = orthancRestClient.findResources("Series", Map.of(
                        "StudyInstanceUID", studyInstanceUID,
                        "ManufacturerModelName", "MONAI Deploy App SDK")
                );
                if (!resources.isEmpty()) {
                    resultFuture.complete(resources.get(0));
                }
            } catch (Exception e) {
                log.error(e.getMessage());
                resultFuture.completeExceptionally(e);
            }
        }, 1, 5, TimeUnit.SECONDS);

        resultFuture.whenComplete((result, exception) -> pollingTask.cancel(false));

        return resultFuture;
    }


    private void waitForJobCompletion(String jobId) {
        pollJobStatus(jobId)
                .orTimeout(monaiDeployProperties.getPacs().getStoreTimeoutSeconds(), TimeUnit.SECONDS)
                .exceptionally(exception -> {
                    log.error(exception.getMessage());

                    if (exception instanceof ExecutionException || exception instanceof InterruptedException) {
                        throw new CompletionException(new ExternalServerResponseError("Ошибка при выполнении запроса к удаленному серверу"));
                    } else if (exception instanceof TimeoutException) {
                        throw new CompletionException(new ExternalServerResponseError("Превышено время ожидания удаленного сервера"));
                    } else {
                        throw new CompletionException(exception);
                    }
                }).join();
    }


    private CompletableFuture<OrthancRestClient.OrthancJob> pollJobStatus(String jobId) {
        CompletableFuture<OrthancRestClient.OrthancJob> resultFuture = new CompletableFuture<>();

        ScheduledFuture<?> pollingTask = executorService.scheduleAtFixedRate(() -> {
            OrthancRestClient.OrthancJob job = orthancRestClient.getJob(jobId);
            if (job.ErrorCode() != 0) {
                log.error("Error while Orthanc job execution: {}, {}", job.ErrorCode(), job.ErrorDescription());
                resultFuture.completeExceptionally(new ExternalServerResponseError("Неожиданный ответ от удаленного сервера"));
            }
            if (job.Progress() == 100 && job.State().equals("Success")) {
                resultFuture.complete(job);
            }
        }, 0, 3, TimeUnit.SECONDS);

        resultFuture.whenComplete((result, exception) -> pollingTask.cancel(false));

        return resultFuture;
    }


}