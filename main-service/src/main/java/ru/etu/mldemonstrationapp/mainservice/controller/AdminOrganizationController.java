package ru.etu.mldemonstrationapp.mainservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.ModelOrganizationLimitRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.ModelOrganizationLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelOrganizationLimit;
import ru.etu.mldemonstrationapp.mainservice.entity.Organization;

import java.util.Map;

@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/admin/organizations")
public class AdminOrganizationController extends OrganizationController {

    /**
     * Create a new organization.
     *
     * @param dto Request body with a new organization data.
     * @param uriComponentsBuilder URI builder used to specify a Location header.
     * @return New organization details.
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "201")
    @PostMapping
    public ResponseEntity<Organization> createOrganization(@Valid @RequestBody CreateOrganizationRequest dto,
                                                           UriComponentsBuilder uriComponentsBuilder) {
        Organization organization = organizationService.createOrganization(dto);
        return ResponseEntity
                .created(uriComponentsBuilder
                        .replacePath("/api/admin/organizations/{organizationId}")
                        .build(Map.of("organizationId", organization.getOrganizationId()))
                )
                .body(organization);
    }

    /**
     * Update organization.
     *
     * @param id The ID of the organization.
     * @param dto Update request with a new organization details.
     * @return Updated organization.
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/{id}")
    public Organization updateOrganization(@PathVariable Long id, @Valid @RequestBody UpdateOrganizationRequest dto) {
        return organizationService.updateOrganization(id, dto);
    }

    /**
     * Delete empty organization by its ID.
     *
     * @param id The ID of the organization.
     * @return No content if successful. Conflict if the organization contains users.
     */
    @ApiResponse(responseCode = "204")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.noContent().build();
    }


    /**
     * Open access and create limit to the model for the organization.
     *
     * @param id The ID of the organization.
     * @param request Request with an ID of the model and limit info.
     * @return {@link ModelOrganizationLimitResponse}
     */
    @Operation(description = "Open access to the model for the organization")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "201")
    @PostMapping("/{id}/models")
    public ResponseEntity<ModelOrganizationLimitResponse> openAccessToModel(@PathVariable Long id, @RequestBody ModelOrganizationLimitRequest request) {
        ModelOrganizationLimit createdLimit = organizationService.createModelLimit(id, request.modelId(), request.limit());
        ModelOrganizationLimitResponse response = new ModelOrganizationLimitResponse(
                createdLimit,
                createdLimit.getModel().getModelId(),
                createdLimit.getModel().getName(),
                "/api/models/" + createdLimit.getModel().getModelId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update a model limit for the organization.
     *
     * @param organizationId The ID of the organization.
     * @param modelId The ID of the model.
     * @param limit New limit to the model for the organization.
     * @return {@link ModelOrganizationLimitResponse}
     */
    @Operation(description = "Update organization limit for available model")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/{organizationId}/models/{modelId}/limit")
    public ModelOrganizationLimit updateModelLimit(@PathVariable Long organizationId, @PathVariable Long modelId, @RequestBody ModelOrganizationLimit limit) {
        return organizationService.updateModelLimit(organizationId, modelId, limit);
    }


    /**
     * Close access to the model and delete the model limit for the organization.
     *
     * @param organizationId The ID of the organization.
     * @param modelId The ID of the model.
     * @return No content if successful.
     */
    @Operation(description = "Close access to model for organization")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @DeleteMapping("/{organizationId}/models/{modelId}")
    public ResponseEntity<Void> closeAccessToModel(@PathVariable Long organizationId,
                                                   @PathVariable Long modelId) {
        organizationService.removeAccessToModel(organizationId, modelId);
        return ResponseEntity.noContent().build();
    }
}
