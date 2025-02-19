package ru.etu.mldemonstrationapp.mainservice.organizations;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.etu.mldemonstrationapp.mainservice.auth.JwtToken;
import ru.etu.mldemonstrationapp.mainservice.organizations.dto.ModelOrganizationLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.organizations.dto.UpdateLimitsTypeRequest;
import ru.etu.mldemonstrationapp.mainservice.users.User;

import java.util.List;

@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {
    protected final OrganizationService organizationService;

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}")
    public Organization getOrganization(@PathVariable Long id) {
        return organizationService.getOrganization(id);
    }


    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}/members")
    public List<User> getOrganizationMembers(@PathVariable Long id) {
        return organizationService.getOrganization(id).getMembers();
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}/models-limits")
    public List<ModelOrganizationLimitResponse> getModelsLimits(@PathVariable Long id) {
        return organizationService.getOrganization(id).getModelsLimits();
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping
    public List<Organization> getOrganizations() {
        return organizationService.getOrganizations();
    }


    @Operation(description = "Change a type of limits for organization members")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @Secured({"ROLE_ORGANIZATION_HEAD", "ROLE_ADMIN"})
    @PutMapping("{id}/limits-type")
    public ResponseEntity<Void> changeLimitType(@PathVariable Long id,
                                                @AuthenticationPrincipal JwtToken jwtToken,
                                                @Valid @RequestBody UpdateLimitsTypeRequest updateLimitsTypeRequest) {
        organizationService.updateOrganizationLimitsType(jwtToken.userId(), id, updateLimitsTypeRequest.limitsType());
        return ResponseEntity.noContent().build();
    }


}
