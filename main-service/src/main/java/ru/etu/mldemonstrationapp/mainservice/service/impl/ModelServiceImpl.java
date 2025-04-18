package ru.etu.mldemonstrationapp.mainservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.entity.Model;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
import ru.etu.mldemonstrationapp.mainservice.entity.Organization;
import ru.etu.mldemonstrationapp.mainservice.repository.ModelRepository;
import ru.etu.mldemonstrationapp.mainservice.repository.ModelVersionRepository;
import ru.etu.mldemonstrationapp.mainservice.service.ModelService;
import ru.etu.mldemonstrationapp.mainservice.service.ThrottlingService;
import ru.etu.mldemonstrationapp.mainservice.service.UserService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelServiceImpl implements ModelService {
    @Autowired
    private ModelRepository modelRepository;
    @Autowired
    private ModelVersionRepository modelVersionRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ThrottlingService throttlingService;

    @Override
    public List<Model> getAvailableModels(Long userId) {
        Organization organization = userService.getUserById(userId).getOrganization();
        return modelRepository.findAllByOrganization(organization);
    }

    @Override
    public Model getModelById(Long id, Long userId) {
        Organization organization = userService.getUserById(userId).getOrganization();
        return modelRepository.findByIdAndOrganization(id, organization).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));
    }

    @Override
    public ModelVersion getModelVersionById(Long id, Long userId) {
        Organization organization = userService.getUserById(userId).getOrganization();
        return modelVersionRepository.findByIdAndOrganization(id, organization).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Model version not found"));
    }

    @Override
    public List<ModelVersion> getAvailableModelsVersions(Long userId) {
        Organization organization = userService.getUserById(userId).getOrganization();
        return modelVersionRepository.findAllByOrganization(organization);
    }

    @Override
    public void runTheModel(Long modelVersionId, Long userId) {
        ModelVersion modelVersion = getModelVersionById(modelVersionId, userId);
        throttlingService.checkRequestLimitExceeded(userId, modelVersion.getModelId());
    }

}

