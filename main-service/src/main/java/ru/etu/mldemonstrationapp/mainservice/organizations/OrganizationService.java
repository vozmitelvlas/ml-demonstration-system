package ru.etu.mldemonstrationapp.mainservice.organizations;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.admin.organizations.dto.CreateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.organizations.dto.UpdateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.models.Limit;
import ru.etu.mldemonstrationapp.mainservice.models.LimitRepository;
import ru.etu.mldemonstrationapp.mainservice.users.User;
import ru.etu.mldemonstrationapp.mainservice.users.UserRepository;
import ru.etu.mldemonstrationapp.mainservice.models.Model;
import ru.etu.mldemonstrationapp.mainservice.models.ModelRepository;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final LimitRepository limitRepository;
    private final UserRepository userRepository;
    private final ModelRepository modelRepository;

    public Organization getOrganization(Long id) {
        return organizationRepository.findById(id).orElseThrow();
    }

    public List<Organization> getOrganizations() {
        return organizationRepository.findAll();
    }

    @Transactional
    public Organization createOrganization(CreateOrganizationRequest dto) {
        if (organizationRepository.existsByName(dto.name())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Organization name already in use");
        }
        return organizationRepository.save(new Organization(
                null,
                dto.name(),
                dto.description(),
                Collections.emptyList(),
                OrganizationLimitsType.ORGANIZATION_LIMITS,
                Collections.emptyList(),
                Instant.now(),
                Instant.now()
        ));
    }

    @Transactional
    public Organization updateOrganization(Long organizationId, UpdateOrganizationRequest dto) {
        Organization organization = organizationRepository.findById(organizationId).orElseThrow();
        if (!organization.getName().equals(dto.name()) && organizationRepository.existsByName(dto.name())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Organization name already in use");
        }
        organization.setName(dto.name());
        organization.setDescription(dto.description());
        return organizationRepository.save(organization);
    }

    @Transactional
    public void updateOrganizationLimitsType(Long userId, Long organizationId, OrganizationLimitsType limitsType) {
        User user = userRepository.findById(userId).orElseThrow();
        Organization organization = organizationRepository.findById(organizationId).orElseThrow();

        if (!user.getOrganization().equals(organization) &&
                user.getRoles().stream().noneMatch(role -> role.getName().equals("ADMIN"))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission to change limits type for this organization"
            );
        }
        organization.setLimitsType(limitsType);
        organizationRepository.save(organization);
    }

    @Transactional
    public void removeAccessToModel(Long organizationId, Long modelId) {
        Organization organization = organizationRepository.findById(organizationId).orElseThrow();
        var limitsIds = organization.getLimits().stream()
                .filter(limit -> limit.getModel().getModelId().equals(modelId))
                .map(Limit::getLimitId)
                .toList();
        limitRepository.deleteAllByIdInBatch(limitsIds);
        organizationRepository.save(organization);
    }


    @Transactional
    public void deleteOrganization(Long organizationId) {
        if (organizationRepository.containsUsers(organizationId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Organization contains users");
        }
        organizationRepository.deleteAllOrganizationsLimits(organizationId);
        organizationRepository.deleteById(organizationId);
    }

    @Transactional
    public ModelOrganizationLimit createModelLimit(Long organizationId, Long modelId, ModelOrganizationLimit limit) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

        Model model = modelRepository.findById(modelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));

        limit.setOrganization(organization);
        limit.setModel(model);

        return limitRepository.save(limit);
    }

    @Transactional
    public ModelOrganizationLimit updateModelLimit(Long organizationId, Long modelId, ModelOrganizationLimit updatedLimit) {
        ModelOrganizationLimit existingLimit = limitRepository.findByOrganizationIdAndModelId(organizationId, modelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Limit not found"));

        existingLimit.setRps(updatedLimit.getRps());
        existingLimit.setRequestsPerWeek(updatedLimit.getRequestsPerWeek());

        return limitRepository.save(existingLimit);
    }

}
