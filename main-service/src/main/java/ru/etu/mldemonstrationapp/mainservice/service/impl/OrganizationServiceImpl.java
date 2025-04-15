package ru.etu.mldemonstrationapp.mainservice.service.impl;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.*;
import ru.etu.mldemonstrationapp.mainservice.repository.*;
import ru.etu.mldemonstrationapp.mainservice.service.OrganizationService;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

@Service
public class OrganizationServiceImpl implements OrganizationService {
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private LimitRepository limitRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelRepository modelRepository;
    @Autowired
    private UserRpwRepository userRpwRepository;

    @Override
    public Organization getOrganization(Long id) {
        return organizationRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Organization> getOrganizations() {
        return organizationRepository.findAll();
    }

    @Transactional
    @Override
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
                Instant.now(),
                true
        ));
    }

    @Transactional
    @Override
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
    @Override
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
    @Override
    public void deleteOrganization(Long organizationId) {
        if (organizationRepository.existsByIdAndIsEditableFalse(organizationId) == Boolean.FALSE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Невозможно удалить базовую организацию");
        }

        // Проверка на наличие пользователей в организации перед удалением
        if (organizationRepository.containsUsers(organizationId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Organization contains users");
        }
        organizationRepository.deleteById(organizationId);
    }

    @Transactional
    @Override
    public ModelOrganizationLimit createModelLimit(Long organizationId, Long modelId, ModelOrganizationLimit limit) {
        if (limitRepository.findByOrganizationIdAndModelId(organizationId, modelId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Organization already has access to this model");
        }
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found"));

        Model model = modelRepository.findById(modelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));

        if (limit == null) {
            limit = new ModelOrganizationLimit();
        }

        if (limit.getRps() == null) {
            limit.setRps(model.getLimit().getRps());
        }
        if (limit.getRequestsPerWeek() == null) {
            limit.setRequestsPerWeek(model.getLimit().getRequestsPerWeek());
        }

        limit.setOrganization(organization);
        limit.setModel(model);



        for (User user : organization.getMembers()) {
            // Create new user limits due to changing of available models list
            ModelUserLimit newLimit = new ModelUserLimit();
            newLimit.setUser(user);
            newLimit.setModel(model);
            newLimit.setRps(model.getLimit().getRps());
            newLimit.setRequestsPerWeek(model.getLimit().getRequestsPerWeek());

            limitRepository.save(newLimit);

            // Create row in user_rpw
            UserRpw userRpw = new UserRpw();
            userRpw.setUser(user);
            userRpw.setModel(model);
            userRpw.setCurrentRequests(0);
            userRpwRepository.save(userRpw);
        }

        return limitRepository.save(limit);
    }

    @Transactional
    @Override
    public ModelOrganizationLimit updateModelLimit(Long organizationId, Long modelId, ModelOrganizationLimit updatedLimit) {
        ModelOrganizationLimit existingLimit = limitRepository.findByOrganizationIdAndModelId(organizationId, modelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization has not access to this model"));

        existingLimit.setRps(updatedLimit.getRps());
        existingLimit.setRequestsPerWeek(updatedLimit.getRequestsPerWeek());

        return limitRepository.save(existingLimit);
    }

    @Transactional
    @Override
    public void removeAccessToModel(Long organizationId, Long modelId) {
        Organization organization = organizationRepository.findById(organizationId).orElseThrow();
        var organizationModelLimits = organization.getLimits().stream()
                .filter(limit -> limit.getModel().getModelId().equals(modelId))
                .map(Limit::getLimitId);

        var userModelLimits = organization.getMembers().stream()
                .flatMap(user -> user.getLimits().stream()
                        .filter(limit -> limit.getModel().getModelId().equals(modelId))
                        .map(Limit::getLimitId));

        limitRepository.deleteAllByIdInBatch((Stream.concat(organizationModelLimits, userModelLimits).toList()));

        List<UserRpw> userRpwToDelete = userRpwRepository.findByOrganizationAndModel(organizationId, modelId);
        userRpwRepository.deleteAllInBatch(userRpwToDelete);

        organizationRepository.save(organization);
    }
}
