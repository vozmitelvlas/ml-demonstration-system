package ru.etu.mldemonstrationapp.mainservice.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.scheduling.TaskScheduler;
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
import ru.etu.mldemonstrationapp.mainservice.exception.*;
import ru.etu.mldemonstrationapp.mainservice.service.ModelInferenceService;
import ru.etu.mldemonstrationapp.mainservice.service.TaskService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
    @Autowired
    private TaskScheduler taskScheduler;

    @Override
    public boolean supports(ModelVersion modelVersion) {
        return modelVersion.getRuntime() == ModelRuntime.MONAI_DEPLOY;
    }

    @Override
    @Async
    public void infer(InferRequest inferRequest, MultipartFile inputFile, UUID taskId) {
        try {
            Path inputFilePath = saveInputFile(inputFile);
            Resource inputResource = new FileSystemResource(inputFilePath);

            String orthancSeriesId = orthancRestClient.uploadDicomInstance(inputResource);

            String jobId = orthancRestClient.sendInstanceToModality(monaiDeployProperties.getAeTitle(), Collections.singletonList(orthancSeriesId));
            pollUntilJobCompleted(jobId).get(monaiDeployProperties.getPacs().getStoreTimeoutSeconds(), TimeUnit.SECONDS);

            // Find DICOM series produced by MONAI model
            String studyInstanceUIDTag = requestStudyInstanceUID(orthancSeriesId);
            String resultSeriesId = pollUntilInferenceResult(studyInstanceUIDTag)
                    .get(monaiDeployProperties.getPacs().getInferenceTaskTimeoutSeconds(), TimeUnit.SECONDS);

            Path resultFilePath = getResultFile(resultSeriesId, taskId);
            taskService.markSuccess(taskId, resultFilePath.toAbsolutePath().toString());

            // Clearing
            orthancRestClient.deleteSeries(resultSeriesId);
            taskScheduler.schedule(() -> {
                taskService.deleteOutputPath(taskId);
                clearArtifacts(inputFilePath, resultFilePath);
            }, Instant.now().plus(monaiDeployProperties.getResultStoringTimeMinutes(), ChronoUnit.MINUTES));

        } catch (Exception e) {
            handleInferenceError(taskId, e);
        }
    }

    private void handleInferenceError(UUID taskId, Exception e) {
        if (e instanceof InterruptedException) {
            Thread.currentThread().interrupt();
            log.error("Inference task thread {} was interrupted: {}", taskId, e.getMessage());
            taskService.markFailed(taskId, "Инференс был прерван");
            return;
        }

        if (e instanceof TimeoutException) {
            log.error("Inference task {} timed out: {}", taskId, e.getMessage());
            taskService.markFailed(taskId, "Время ожидания ответа от инференс-сервера истекло");
            return;
        }

        if (e instanceof ExecutionException) {
            Throwable cause = e.getCause();
            String errorMessage = Optional.ofNullable(cause)
                    .map(Throwable::getMessage)
                    .orElse("Error occurred during inference execution");

            log.error("Orthanc server error: {}", errorMessage);
            taskService.markFailed(taskId, errorMessage);
            return;
        }

        if (e instanceof ExternalServerException) {
            log.error("Orthanc REST client error: {}", e.getMessage());
            taskService.markFailed(taskId, e.getMessage());
            return;
        }

        if (e instanceof InferenceInputException) {
            log.error("Incorrect format of input file: {}", e.getMessage());
            taskService.markFailed(taskId, e.getMessage());
            return;
        }

        // General fallback
        log.error("Unhandled inference error: {}", e.getMessage());
        taskService.markFailed(taskId, "Ошибка инференса");
        throw new InferenceFailedException(e);
    }


    public ResponseEntity<?> getInferenceResult(Task task) {
        if (Objects.isNull(task.getOutputPath())) {
            throw new NoSuchElementException("Результат задачи %s недоступен".formatted(task.getTaskId()));
        }

        try {
            Path inferenceResultPath = Path.of(task.getOutputPath());
            var resource = new InputStreamResource(Files.newInputStream(inferenceResultPath));
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition
                            .attachment()
                            .filename(inferenceResultPath.getFileName().toString())
                            .build().toString())
                    .body(resource);
        } catch (IOException e) {
            log.error("Error while sending inference result: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка при загрузке файла результата", e);
        }
    }


    private Path saveInputFile(MultipartFile inputFile) {
        try {
            if (inputFile == null || inputFile.isEmpty()) {
                throw new IOException("Multipart input file is empty or null");
            }

            Path filePath = Files.createTempFile("upload-", "-" + inputFile.getOriginalFilename());
            Files.copy(inputFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return filePath;
        } catch (IOException e) {
            log.error("Error while saving input file: {}", e.getMessage());
            throw new InferenceInputException("Ошибка при сохранении входных данных модели", e);
        }
    }

    private CompletableFuture<OrthancRestClient.OrthancJob> pollUntilJobCompleted(String jobId) {
        CompletableFuture<OrthancRestClient.OrthancJob> resultFuture = new CompletableFuture<>();

        ScheduledFuture<?> pollingTask = taskScheduler.scheduleAtFixedRate(() -> {
            OrthancRestClient.OrthancJob job = orthancRestClient.getJob(jobId);
            if (job.ErrorCode() != 0) {
                log.error("Error while Orthanc job execution: {}, {}", job.ErrorCode(), job.ErrorDescription());
                resultFuture.completeExceptionally(new ExternalServerInternalException("Неожиданный ответ от удаленного сервера"));
            }
            if (job.Progress() == 100 && job.State().equals("Success")) {
                resultFuture.complete(job);
            }
        }, Duration.ofSeconds(3));

        resultFuture.whenComplete((result, exception) -> pollingTask.cancel(false));

        return resultFuture;
    }

    private String requestStudyInstanceUID(String orthancSeriesId) {
        List<String> requestedTags = List.of("0020,000d");
        OrthancRestClient.OrthancSeries series = orthancRestClient.getSeries(orthancSeriesId, requestedTags);
        return Optional.ofNullable(series.RequestedTags().get("StudyInstanceUID")).orElseThrow(() -> {
            log.error("Not found StudyInstanceUID tag in Orthanc Series {} details", orthancSeriesId);
            return new ExternalServerInternalException(String.format("Не удалось получить значение тега StudyInstanceUID для серии %s", orthancSeriesId));
        });

    }


    private CompletableFuture<String> pollUntilInferenceResult(String studyInstanceUID) {
        CompletableFuture<String> resultFuture = new CompletableFuture<>();

        ScheduledFuture<?> pollingTask = taskScheduler.scheduleWithFixedDelay(() -> {
            try {
                List<String> resources = orthancRestClient.findResources("Series", Map.of("StudyInstanceUID", studyInstanceUID, "ManufacturerModelName", "MONAI Deploy App SDK"));
                if (!resources.isEmpty()) {
                    resultFuture.complete(resources.get(0));
                }
            } catch (Exception e) {
                log.error(e.getMessage());
                resultFuture.completeExceptionally(e);
            }
        }, Duration.ofSeconds(5));

        resultFuture.whenComplete((result, exception) -> pollingTask.cancel(false));

        return resultFuture;
    }

    private Path getResultFile(String resultSeriesId, UUID taskId) {
        Resource resource = orthancRestClient.getZip(resultSeriesId);
        try (InputStream inputStream = resource.getInputStream()) {
            Path resultFilePath = Files.createTempFile("result-", "-" + taskId.toString() + ".zip");
            Files.copy(inputStream, resultFilePath, StandardCopyOption.REPLACE_EXISTING);
            return resultFilePath;
        } catch (IOException e) {
            log.error(e.getMessage());
            throw new ExternalServerInternalException("Ошибка при сохранении результата инференса");
        }
    }

    private void clearArtifacts(Path inputFile, Path resultFile) {
        try {
            Files.deleteIfExists(inputFile);
            Files.deleteIfExists(resultFile);
        } catch (IOException e) {
            log.error("Error while deleting inference artifacts: {}", e.getMessage());
        }
    }

}