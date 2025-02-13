package ru.etu.mldemonstrationapp.mainservice.admin.models;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.admin.models.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.models.dto.CreateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.models.dto.UpdateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.models.*;
import ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminModelsService {
    private final ModelRepository modelRepository;
    private final ModelVersionRepository modelVersionRepository;

    public Model getModel(Long modelId) {
        return modelRepository.findById(modelId).orElseThrow();
    }

    public List<Model> getModels() {
        return modelRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public ModelVersionResponse getModelVersion(Long versionId) {
        return modelVersionRepository.findModelVersionById(versionId).orElseThrow();
    }

    public List<ModelVersionResponse> getModelsVersions() {
        return modelVersionRepository.findModelVersions();
    }

    @Transactional
    public Model createModel(CreateModelRequest dto) {
        if (modelRepository.existsByName(dto.name())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Model name already in use");
        }
        Model model = new Model();
        model.setName(dto.name());
        model = modelRepository.save(model);

        ModelInfo modelInfo = new ModelInfo();
        modelInfo.setRuntime(dto.runtime());
        modelInfo.setProblemType(dto.problemType());
        modelInfo.setModelId(model.getModelId());

        model.setModelInfo(modelInfo);

        ModelVersion modelVersion = new ModelVersion();
        modelVersion.setVersionName("1.0");
        modelVersion.setUri(dto.uri());
        modelVersion.setDescription(dto.description());
        modelVersion.setModel(model);

        model.getModelVersions().add(modelVersion);
        return modelRepository.save(model);
    }

    @Transactional
    public ModelVersionResponse createModelVersion(Long modelId, CreateModelVersionRequest dto) {
        Model model = modelRepository.findById(modelId).orElseThrow();
        if (modelVersionRepository.versionNameUnique(model.getModelId(), dto.versionName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Version name already in use");
        }
        ModelVersion modelVersion = modelVersionRepository.save(new ModelVersion(
                null,
                dto.versionName(),
                dto.description(),
                dto.uri(),
                model,
                Instant.now(),
                Instant.now())
        );
        return new ModelVersionResponse(
                model.getModelId(),
                model.getName(),
                modelVersion.getModelVersionId(),
                modelVersion.getVersionName(),
                modelVersion.getDescription(),
                modelVersion.getUri(),
                model.getModelInfo(),
                model.getLimit(),
                modelVersion.getUpdatedAt(),
                modelVersion.getCreatedAt()
        );
    }

    @Transactional
    public ModelVersionResponse updateModelVersion(Long versionId, UpdateModelVersionRequest dto) {
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

        return new ModelVersionResponse(
                model.getModelId(),
                model.getName(),
                modelVersion.getModelVersionId(),
                modelVersion.getVersionName(),
                modelVersion.getDescription(),
                modelVersion.getUri(),
                modelVersion.getModel().getModelInfo(),
                modelVersion.getModel().getLimit(),
                modelVersion.getUpdatedAt(),
                modelVersion.getCreatedAt()
        );
    }

    @Transactional
    void deleteModelVersion(Long id) {
        ModelVersion modelVersion = modelVersionRepository.findById(id).orElseThrow();
        Long modelId = modelVersion.getModel().getModelId();
        modelVersionRepository.delete(modelVersion);
        modelRepository.deleteModelIfVersionsListEmpty(modelId);
    }
}
