package ru.etu.mldemonstrationapp.mainservice.service;

import ru.etu.mldemonstrationapp.mainservice.entity.Model;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;

import java.util.List;

public interface ModelService {
    List<Model> getAvailableModels(Long userId);

    Model getModelById(Long id, Long userId);

    ModelVersion getModelVersionById(Long id, Long userId);

    List<ModelVersion> getAvailableModelsVersions(Long userId);
}
