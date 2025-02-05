package ru.etu.mldemonstrationapp.mainservice.models;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.models.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse;
import ru.etu.mldemonstrationapp.mainservice.models.dto.UpdateModelRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelService {
    private final ModelRepository modelRepository;
    private final ModelVersionRepository modelVersionRepository;

    public List<Model> getAllModels() {
        return modelRepository.findAll();
    }

    public Model getModelById(Long id) {
        return modelRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));
    }

    @Transactional
    public Model createModel(CreateModelRequest request) {
        Model model = new Model();
        model.setName(request.name());
        model.setModelInfo(request.modelInfo());
        model.setLimit(request.limit());
        return modelRepository.save(model);
    }

    @Transactional
    public Model updateModel(Long id, UpdateModelRequest request) {
        Model model = getModelById(id);
        model.setName(request.name());
        model.setModelInfo(request.modelInfo());
        model.setLimit(request.limit());
        return modelRepository.save(model);
    }

    @Transactional
    public void deleteModel(Long id) {
        Model model = getModelById(id);
        modelRepository.delete(model);
    }

    public ModelVersionResponse getModelVersionById(Long id) {
        return modelVersionRepository.findModelVersionById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Model version not found"));
    }

    public List<ModelVersionResponse> getAllModelVersions() {
        return modelVersionRepository.findModelVersions();
    }
}
