package ru.etu.mldemonstrationapp.mainservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.Limit;
import ru.etu.mldemonstrationapp.mainservice.entity.Model;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
import ru.etu.mldemonstrationapp.mainservice.service.AdminModelsService;

import java.util.List;
import java.util.Map;

@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/admin/models")
public class AdminModelController {
    @Autowired
    private AdminModelsService adminModelsService;

    /**
     * Get all models with a list of versions.
     *
     * @return List of all models with versions.
     */
    @Operation(description = "Get all models with a list of versions for each of them")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping
    public List<Model> getModels() {
        return adminModelsService.getModels();
    }

    /**
     * Get model by its ID with a list of versions.
     *
     * @param id The ID of the model.
     * @return The model with the specified ID.
     */
    @Operation(description = "Get model by id with a list of versions")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}")
    public Model getModel(@PathVariable Long id) {
        return adminModelsService.getModel(id);
    }

    /**
     * Get version of the model by model ID and version ID.
     *
     * @param modelId The ID of the model.
     * @param versionId The ID of the model version.
     * @return The version of the model.
     */
    @Operation(description = "Get version of a model by model id and version id")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{modelId}/versions/{versionId}")
    public ModelVersion getModelVersion(@PathVariable Long modelId, @PathVariable Long versionId) {
        return adminModelsService.getModelVersion(versionId);
    }

    /**
     * Get a list of all model versions.
     *
     * @return List of all model versions.
     */
    @Operation(description = "Get all versions of all models")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/versions")
    public List<ModelVersion> getModelsVersions() {
        return adminModelsService.getModelsVersions();
    }

    /**
     * Register a new model with a default model version creating.
     *
     * @param createModelRequest Request with a new model data.
     * @param uriComponentsBuilder URI builder used to specify a Location header.
     * @return The default version of the new model.
     */
    @Operation(description = "Register a new model")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "201")
    @PostMapping
    public ResponseEntity<ModelVersion> registerModel(@Valid @RequestBody CreateModelRequest createModelRequest,
                                               UriComponentsBuilder uriComponentsBuilder) {
        Model model = adminModelsService.createModel(createModelRequest);
        ModelVersion modelVersion = model.getModelVersions().get(0);
        return ResponseEntity
                .created(uriComponentsBuilder
                        .replacePath("/api/admin/models/{modelId}/versions/{versionId}")
                        .build(Map.of("modelId", model.getModelId(), "versionId", modelVersion.getModelVersionId()))
                )
                .body(modelVersion);
    }

    /**
     * Create a new version of an existing model
     *
     * @param id The ID of the model.
     * @param createModelVersionRequest Request with a new model version data
     * @param uriComponentsBuilder URI builder used to specify a Location header.
     * @return New version of the model with specified ID.
     */
    @Operation(description = "Create a new version of an existing model")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "201")
    @PostMapping("/{id}/versions")
    public ResponseEntity<ModelVersion> createModelVersion(@PathVariable Long id,
                                                           @Valid @RequestBody CreateModelVersionRequest createModelVersionRequest,
                                                           UriComponentsBuilder uriComponentsBuilder) {
        ModelVersion modelVersion = adminModelsService.createModelVersion(id, createModelVersionRequest);
        return ResponseEntity
                .created(uriComponentsBuilder
                        .replacePath("/api/admin/models/{modelId}/versions/{versionId}")
                        .build(Map.of(
                                "modelId", modelVersion.getModelId(),
                                "versionId", modelVersion.getModelVersionId())
                        )
                )
                .body(modelVersion);

    }

    /**
     * Update a version of the model.
     *
     * @param modelId The ID of the model.
     * @param versionId The ID of the model version.
     * @param updateModelVersionRequest The update request with a new model version details.
     * @return Updated model version.
     */
    @Operation(description = "Update model version")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/{modelId}/versions/{versionId}")
    public ModelVersion updateModel(@PathVariable Long modelId, @PathVariable Long versionId,
                                    @Valid @RequestBody UpdateModelVersionRequest updateModelVersionRequest) {
        return adminModelsService.updateModelVersion(versionId, updateModelVersionRequest);
    }


    /**
     * Update model limit
     *
     * @param id The ID of the model.
     * @param limit New limit of the model.
     * @return {@link Limit}
     */
    @Operation(description = "Update model limit")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/{id}/limit")
    public Limit updateModelLimit(@PathVariable Long id, @Valid @RequestBody Limit limit) {
        return adminModelsService.updateModelLimit(id, limit);
    }

    /**
     * Delete version of the model by model ID and version ID.
     *
     * @param modelId The ID of the model.
     * @param versionId The ID of the model version.
     * @return No content if successful.
     */
    @Operation(description = "Delete model version. If deleted version was last then delete model too")
    @ApiResponse(responseCode = "204")
    @DeleteMapping("/{modelId}/versions/{versionId}")
    public ResponseEntity<Void> deleteModelVersion(@PathVariable Long modelId, @PathVariable Long versionId) {
        adminModelsService.deleteModelVersion(versionId);
        return ResponseEntity.noContent().build();
    }
}


