package ru.etu.mldemonstrationapp.mainservice.admin.organizations;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;
import ru.etu.mldemonstrationapp.mainservice.organizations.OrganizationController;
import ru.etu.mldemonstrationapp.mainservice.organizations.OrganizationService;
import ru.etu.mldemonstrationapp.mainservice.admin.organizations.dto.CreateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.organizations.dto.UpdateOrganizationRequest;

import java.util.Map;

@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/admin/organizations")
public class AdminOrganizationController extends OrganizationController {
    public AdminOrganizationController(OrganizationService organizationService) {
        super(organizationService);
    }

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

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/{id}")
    public Organization updateOrganization(@PathVariable Long id, @Valid @RequestBody UpdateOrganizationRequest dto) {
        return organizationService.updateOrganization(id, dto);
    }

    @ApiResponse(responseCode = "204")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.noContent().build();
    }


}
