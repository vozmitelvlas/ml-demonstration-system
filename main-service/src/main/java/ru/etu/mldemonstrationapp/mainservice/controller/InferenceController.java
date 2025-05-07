package ru.etu.mldemonstrationapp.mainservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.etu.mldemonstrationapp.mainservice.components.ModelInferenceServiceFactory;
import ru.etu.mldemonstrationapp.mainservice.configuration.JwtToken;
import ru.etu.mldemonstrationapp.mainservice.dto.InferRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
import ru.etu.mldemonstrationapp.mainservice.entity.Task;
import ru.etu.mldemonstrationapp.mainservice.service.ModelInferenceService;
import ru.etu.mldemonstrationapp.mainservice.service.ModelService;
import ru.etu.mldemonstrationapp.mainservice.service.TaskService;
import ru.etu.mldemonstrationapp.mainservice.service.ThrottlingService;

import java.util.UUID;

@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/inference")
public class InferenceController {
    @Autowired
    private ModelInferenceServiceFactory modelInferenceServiceFactory;

    @Autowired
    private ModelService modelService;

    @Autowired
    private ThrottlingService throttlingService;

    @Autowired
    private TaskService taskService;

    /**
     * Perform inference using a specified model deployed on the inference server.
     *
     * @param inferRequest inference request
     * @param jwtToken     the JWT token containing the user ID, used to verify access permissions for model inference.
     * @return Inference task ID
     */
        @Operation(description = "Run model inference and get inference task ID for tracking")
        @ApiResponse(responseCode = "202", useReturnTypeSchema = true)
        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<UUID> performInference(@Valid @RequestPart("parameters") InferRequest inferRequest,
                                                     @RequestPart(required = false, name = "file") MultipartFile input,
                                                     @AuthenticationPrincipal JwtToken jwtToken) {
            ModelVersion modelVersion = modelService.getModelVersionById(inferRequest.modelVersionId(), jwtToken.userId());
            throttlingService.checkRequestLimitExceeded(modelVersion.getModelId(), jwtToken.userId());

            ModelInferenceService inferenceService = modelInferenceServiceFactory.getInferenceService(modelVersion);
            Task task = taskService.createTask(jwtToken.userId(), modelVersion);
            inferenceService.infer(inferRequest, input, task.getTaskId());
            return ResponseEntity.accepted().body(task.getTaskId());
        }

    @Operation(description = "Get status of the inference task")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @GetMapping("/tasks/{id}")
    public Task getTask(@PathVariable UUID id) {
        return taskService.getTask(id);
    }

    @Operation(description = "Get result of the inference task")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @GetMapping("/tasks/{id}/result")
    public ResponseEntity<?> getTaskResult(@PathVariable UUID id) {
        Task task = taskService.getTask(id);
        ModelInferenceService modelInferenceService = modelInferenceServiceFactory.getInferenceService(task.getModelVersion());
        return modelInferenceService.getInferenceResult(task);
    }


}

