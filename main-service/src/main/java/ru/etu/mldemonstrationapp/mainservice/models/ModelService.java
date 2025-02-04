package ru.etu.mldemonstrationapp.mainservice.models;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelService {
    private final ModelRepository modelRepository;
    private final ModelVersionRepository modelVersionRepository;

    public Model getModelById(Long id) {
        return modelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Модель не найдена"));
    }

    public List<Model> getAllModels() {
        return modelRepository.findAll();
    }

    @Transactional
    public Model createModel(Model model) {
        return modelRepository.save(model);
    }

    @Transactional
    public void deleteModel(Long id) {
        modelRepository.deleteModelIfVersionsListEmpty(id);
    }

    public List<ModelVersionResponse> getModelVersions(Long modelId) {
        return modelVersionRepository.findModelVersions();
    }
}
