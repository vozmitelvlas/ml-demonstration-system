package ru.etu.mldemonstrationapp.mainservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.etu.mldemonstrationapp.mainservice.configuration.JwtToken;
import ru.etu.mldemonstrationapp.mainservice.entity.Model;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
import ru.etu.mldemonstrationapp.mainservice.service.ModelService;

import java.util.List;

@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/models")
public class ModelController {
    @Autowired
    private ModelService modelService;

    /**
     * Get all models available to the current user.
     *
     * @param jwtToken The JWT token containing the user ID.
     * @return No content if successful.
     */
    @Operation(description = "Get available models")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @GetMapping
    public ResponseEntity<List<Model>> getAvailableModels(@AuthenticationPrincipal JwtToken jwtToken) {
        return ResponseEntity.ok(modelService.getAvailableModels(jwtToken.userId()));
    }

    /**
     * Get model by its ID with a list of versions
     *
     * @param id The ID of the model
     * @param jwtToken The JWT token containing the user ID.
     * @return The model with the specified ID if user has access to it, otherwise not found.
     */
    @GetMapping("/{id}")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    public ResponseEntity<Model> getModelById(@PathVariable Long id, @AuthenticationPrincipal JwtToken jwtToken) {
        return ResponseEntity.ok(modelService.getModelById(id, jwtToken.userId()));
    }

    /**
     * Get version of the model by version ID.
     *
     * @param id The ID of the model version.
     * @param jwtToken The JWT token containing the user ID.
     * @return The version of the model if user has access to it, otherwise not found.
     */
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @GetMapping("/versions/{id}")
    public ResponseEntity<ModelVersion> getModelVersionById(@PathVariable Long id, @AuthenticationPrincipal JwtToken jwtToken) {
        return ResponseEntity.ok(modelService.getModelVersionById(id, jwtToken.userId()));
    }

    /**
     * Get all versions of the models available to the current user.
     *
     * @param jwtToken The JWT token containing the user ID.
     * @return List of all versions of the models available to the current user.
     */
    @Operation(description = "Get all versions of available models")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @GetMapping("/versions")
    public ResponseEntity<List<ModelVersion>> getAvailableModelsVersions(@AuthenticationPrincipal JwtToken jwtToken) {
        return ResponseEntity.ok(modelService.getAvailableModelsVersions(jwtToken.userId()));
    }
}