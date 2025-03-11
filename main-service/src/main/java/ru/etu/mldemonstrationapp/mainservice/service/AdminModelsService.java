package ru.etu.mldemonstrationapp.mainservice.service;

import jakarta.transaction.Transactional;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.Limit;
import ru.etu.mldemonstrationapp.mainservice.entity.Model;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;

import java.util.List;

public interface AdminModelsService {
    Model getModel(Long modelId);

    List<Model> getModels();

    ModelVersion getModelVersion(Long versionId);

    List<ModelVersion> getModelsVersions();

    @Transactional
    Model createModel(CreateModelRequest dto);

    @Transactional
    ModelVersion createModelVersion(Long modelId, CreateModelVersionRequest dto);

    @Transactional
    ModelVersion updateModelVersion(Long versionId, UpdateModelVersionRequest dto);

    @Transactional
    Limit updateModelLimit(Long modelId, Limit limit);

    @Transactional
    void deleteModelVersion(Long id);
}
