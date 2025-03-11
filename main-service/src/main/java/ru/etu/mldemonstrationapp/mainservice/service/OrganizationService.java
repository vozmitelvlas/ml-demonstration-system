package ru.etu.mldemonstrationapp.mainservice.service;

import jakarta.transaction.Transactional;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateOrganizationRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelOrganizationLimit;
import ru.etu.mldemonstrationapp.mainservice.entity.Organization;
import ru.etu.mldemonstrationapp.mainservice.entity.OrganizationLimitsType;

import java.util.List;

public interface OrganizationService {
    Organization getOrganization(Long id);

    List<Organization> getOrganizations();

    @Transactional
    Organization createOrganization(CreateOrganizationRequest dto);

    @Transactional
    Organization updateOrganization(Long organizationId, UpdateOrganizationRequest dto);

    @Transactional
    void updateOrganizationLimitsType(Long userId, Long organizationId, OrganizationLimitsType limitsType);

    @Transactional
    void deleteOrganization(Long organizationId);

    @Transactional
    ModelOrganizationLimit createModelLimit(Long organizationId, Long modelId, ModelOrganizationLimit limit);

    @Transactional
    ModelOrganizationLimit updateModelLimit(Long organizationId, Long modelId, ModelOrganizationLimit updatedLimit);

    @Transactional
    void removeAccessToModel(Long organizationId, Long modelId);
}
