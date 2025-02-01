package ru.etu.mldemonstrationapp.mainservice.admin.models;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.etu.mldemonstrationapp.mainservice.admin.models.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.models.dto.CreateModelVersionRequest;
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

}
