package ru.etu.mldemonstrationapp.mainservice.admin.organizations;

import io.swagger.v3.oas.annotations.Operation;
 import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;
import ru.etu.mldemonstrationapp.mainservice.organizations.OrganizationService;
import ru.etu.mldemonstrationapp.mainservice.organizations.dto.CreateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.organizations.dto.UpdateOrganizationRequest;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/organizations")
@RequiredArgsConstructor
public class AdminOrganizationController {
    private final OrganizationService organizationService;

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

    @ApiResponse(useReturnTypeSchema = true, responseCode = "201")
    @PostMapping
    public ResponseEntity<Organization> createOrganization(@RequestBody CreateOrganizationRequest dto,
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
    public Organization updateOrganization(@RequestBody Long id, @RequestBody UpdateOrganizationRequest dto) {
        return organizationService.updateOrganization(id, dto);
    }

    @ApiResponse(responseCode = "204")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.noContent().build();
    }


}
