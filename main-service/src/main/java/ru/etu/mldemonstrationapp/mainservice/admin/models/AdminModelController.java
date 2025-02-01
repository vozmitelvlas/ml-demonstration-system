package ru.etu.mldemonstrationapp.mainservice.admin.models;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import ru.etu.mldemonstrationapp.mainservice.admin.models.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.models.dto.CreateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.models.Model;
import ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/models")
@RequiredArgsConstructor
public class AdminModelController {
    private final AdminModelsService adminModelsService;

    @Operation(description = "Get all models with a list of versions for each of them")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping
    public List<Model> getModels() {
        return adminModelsService.getModels();
    }

    @Operation(description = "Get model by id with a list of versions")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}")
    public Model getModel(@PathVariable Long id) {
        return adminModelsService.getModel(id);
    }

    @Operation(description = "Get version of a model by model id and version id")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{modelId}/versions/{versionId}")
    public ModelVersionResponse getModelVersion(@PathVariable Long modelId, @PathVariable Long versionId) {
        return adminModelsService.getModelVersion(versionId);
    }

    @Operation(description = "Get all versions of all models")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/versions")
    public List<ModelVersionResponse> getModelsVersions() {
        return adminModelsService.getModelsVersions();
    }

    @Operation(description = "Register new model")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "201")
    @PostMapping
    public ResponseEntity<Model> registerModel(@RequestBody CreateModelRequest createModelRequest,
                                               UriComponentsBuilder uriComponentsBuilder) {
        Model model = adminModelsService.createModel(createModelRequest);
        return ResponseEntity
                .created(uriComponentsBuilder
                        .replacePath("/api/admin/models/{modelId}")
                        .build(Map.of("modelId", model.getModelId()))
                )
                .body(model);
    }

    @Operation(description = "Create a new version of an existing model")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "201")
    @PostMapping("/{id}/versions")
    public ResponseEntity<ModelVersionResponse> createModelVersion(@PathVariable Long id,
                                                                   @RequestBody CreateModelVersionRequest createModelVersionRequest,
                                                                   UriComponentsBuilder uriComponentsBuilder) {
        ModelVersionResponse modelVersion = adminModelsService.createModelVersion(id, createModelVersionRequest);
        return ResponseEntity
                .created(uriComponentsBuilder
                        .replacePath("/api/admin/models/{modelId}/versions/{versionId}")
                        .build(Map.of(
                                "modelId", modelVersion.modelId(),
                                "versionId", modelVersion.versionId())
                        )
                )
                .body(modelVersion);

    }

}


