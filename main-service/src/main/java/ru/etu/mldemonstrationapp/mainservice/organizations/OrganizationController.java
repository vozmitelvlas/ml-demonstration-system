package ru.etu.mldemonstrationapp.mainservice.organizations;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @GetMapping
    public List<Organization> getOrganizations() {
        return organizationService.getOrganizations();
    }
}
