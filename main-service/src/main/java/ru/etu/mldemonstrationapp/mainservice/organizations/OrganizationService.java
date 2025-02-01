package ru.etu.mldemonstrationapp.mainservice.organizations;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.etu.mldemonstrationapp.mainservice.organizations.dto.CreateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.organizations.dto.UpdateOrganizationRequest;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationService {
    private final OrganizationRepository organizationRepository;

    public Organization getOrganization(Long id) {
        return organizationRepository.findById(id).orElseThrow();
    }

    public List<Organization> getOrganizations() {
        return organizationRepository.findAll();
    }

    @Transactional
    public Organization createOrganization(CreateOrganizationRequest dto) {
        return organizationRepository.save(new Organization(
                null,
                dto.name(),
                dto.description(),
                Instant.now(),
                Instant.now()
        ));
    }


    @Transactional
    public Organization updateOrganization(Long organizationId, UpdateOrganizationRequest dto) {
        Organization organization = organizationRepository.findById(organizationId).orElseThrow();
        organization.setName(dto.name());
        organization.setDescription(dto.description());
        return organizationRepository.save(organization);
    }

    @Transactional
    public void deleteOrganization(Long organizationId) {
        organizationRepository.deleteById(organizationId);
    }

}
