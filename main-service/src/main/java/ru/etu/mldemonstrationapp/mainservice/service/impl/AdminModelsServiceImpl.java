package ru.etu.mldemonstrationapp.mainservice.service.impl;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.clients.monai.WorkflowManagerClient;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.*;
import ru.etu.mldemonstrationapp.mainservice.repository.ModelRepository;
import ru.etu.mldemonstrationapp.mainservice.repository.ModelVersionRepository;
import ru.etu.mldemonstrationapp.mainservice.service.AdminModelsService;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class AdminModelsServiceImpl implements AdminModelsService {
    @Autowired
    private ModelRepository modelRepository;
    @Autowired
    private ModelVersionRepository modelVersionRepository;
    @Autowired
    private WorkflowManagerClient workflowManagerClient;


    @Override
    public Model getModel(Long modelId) {
        return modelRepository.findById(modelId).orElseThrow();
    }

    @Override
    public List<Model> getModels() {
        return modelRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Override
    public ModelVersion getModelVersion(Long versionId) {
        return modelVersionRepository.findById(versionId).orElseThrow();
    }

    @Override
    public List<ModelVersion> getModelsVersions() {
        return modelVersionRepository.findAll();
    }

    @Transactional
    @Override
    public Model createModel(CreateModelRequest dto) {
        if (modelRepository.existsByName(dto.name())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Model name already in use");
        }

        Model model = new Model();
        model.setName(dto.name());

        // Default limit
        Limit limit = new Limit(null, 100, 100);
        model.setLimit(limit);

        ModelInfo modelInfo = new ModelInfo();
        modelInfo.setRuntime(dto.runtime());
        modelInfo.setProblemType(dto.problemType());
        modelInfo.setModel(model);

        model.setModelInfo(modelInfo);
        modelRepository.save(model);


        // Add default version of the model
        ModelVersion modelVersion = new ModelVersion();
        modelVersion.setVersionName("1.0");
        modelVersion.setUri(dto.uri());
        modelVersion.setDescription(dto.description());
        modelVersion.setModel(model);

        model.getModelVersions().add(modelVersion);
        modelRepository.save(model);

        if (dto.runtime() == ModelRuntime.MONAI_DEPLOY) {
            if (dto.config() == null || dto.config().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Конфигурация workflow не указана");
            }
            String workflowId = workflowManagerClient.registerWorkflow(dto.config()).workflow_id();
            model.setOtherData(Map.of("workflowId", workflowId));
        }

        return modelRepository.save(model);
    }

    @Transactional
    @Override
    public ModelVersion createModelVersion(Long modelId, CreateModelVersionRequest dto) {
        Model model = modelRepository.findById(modelId).orElseThrow();
        if (modelVersionRepository.versionNameUnique(model.getModelId(), dto.versionName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Version name already in use");
        }
        return modelVersionRepository.save(new ModelVersion(
                null,
                dto.versionName(),
                dto.description(),
                dto.uri(),
                model,
                Instant.now(),
                Instant.now()
        ));
    }

    @Transactional
    @Override
    public ModelVersion updateModelVersion(Long versionId, UpdateModelVersionRequest dto) {
        ModelVersion modelVersion = modelVersionRepository.findById(versionId).orElseThrow();
        Model model = modelVersion.getModel();

        boolean isModelNameChanged = !dto.modelName().equals(model.getName());
        if (isModelNameChanged && modelRepository.existsByName(dto.modelName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Model name already in use");
        }

        boolean isVersionNameChanged = !dto.versionName().equals(modelVersion.getVersionName());
        if (isVersionNameChanged && modelVersionRepository.versionNameUnique(model.getModelId(), dto.versionName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Version name already in use");
        }

        model.setName(dto.modelName());
        model.getModelInfo().setRuntime(dto.runtime());
        model.getModelInfo().setProblemType(dto.problemType());

        modelVersion.setVersionName(dto.versionName());
        modelVersion.setUri(dto.uri());
        modelVersion.setDescription(dto.description());

        modelRepository.save(model);

        return modelVersion;
    }

    @Transactional
    @Override
    public Limit updateModelLimit(Long modelId, Limit limit) {
        Model model = modelRepository.findById(modelId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));
        model.getLimit().setRps(limit.getRps());
        model.getLimit().setRequestsPerWeek(limit.getRequestsPerWeek());
        return modelRepository.save(model).getLimit();
    }

    @Transactional
    @Override
    public void deleteModelVersion(Long id) {
        ModelVersion modelVersion = modelVersionRepository.findById(id).orElseThrow();
        Model model = modelVersion.getModel();
        if (modelVersion.getModel().getModelVersions().size() == 1 && model.getRuntime() == ModelRuntime.MONAI_DEPLOY) {
            workflowManagerClient.deleteWorkflow(model.getOtherData().get("workflowId"));
        }
        modelVersionRepository.delete(modelVersion);

        // Limit entity is removed because the model will be removed by cascade
        modelRepository.deleteModelIfVersionsListEmpty(model.getModelId());
    }
}
