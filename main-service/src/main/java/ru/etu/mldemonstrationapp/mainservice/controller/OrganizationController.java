package ru.etu.mldemonstrationapp.mainservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.etu.mldemonstrationapp.mainservice.configuration.JwtToken;
import ru.etu.mldemonstrationapp.mainservice.dto.ModelOrganizationLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateLimitsTypeRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.Organization;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.service.OrganizationService;

import java.util.List;

/**
 * Controller for handling organization-related requests.
 *
 */
@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/organizations")
public class OrganizationController {
    @Autowired
    protected OrganizationService organizationService;

    /**
     * Get an organization by its ID.
     * 
     * @param id The ID of the organization.
     * @return The organization with the specified ID.     
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}")
    public Organization getOrganization(@PathVariable Long id) {
        return organizationService.getOrganization(id);
    }


    /**
     * Get the members of an organization.
     * 
     * @param id The ID of the organization.
     * @return A list of users who are members of the specified organization.
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}/members")
    public List<User> getOrganizationMembers(@PathVariable Long id) {
        return organizationService.getOrganization(id).getMembers();
    }

    /**
     * Get the models limits for an organization. A model limit only exists if organization has access to the model.
     * 
     * @param id The ID of the organization.
     * @return A list of models limits for the specified organization.
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}/models")
    public List<ModelOrganizationLimitResponse> getModelsLimits(@PathVariable Long id) {
        return organizationService.getOrganization(id).getModelsLimits();
    }

    /**
     * Get list of organizations.
     * 
     * @return List of organizations.
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping
    public List<Organization> getOrganizations() {
        return organizationService.getOrganizations();
    }


    /**
     * Change a type of limits for organization members.
     * 
     * @param id The ID of the organization.
     * @param jwtToken JWT token for authentication.
     * @param updateLimitsTypeRequest Request body containing the new limits type.
     * @return No content if successful.
     */
    @Operation(description = "Change a type of limits for organization members")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @PutMapping("{id}/limits-type")
    public ResponseEntity<Void> changeLimitType(@PathVariable Long id,
                                                @AuthenticationPrincipal JwtToken jwtToken,
                                                @Valid @RequestBody UpdateLimitsTypeRequest updateLimitsTypeRequest) {
        organizationService.updateOrganizationLimitsType(jwtToken.userId(), id, updateLimitsTypeRequest.limitsType());
        return ResponseEntity.noContent().build();
    }
    
}
