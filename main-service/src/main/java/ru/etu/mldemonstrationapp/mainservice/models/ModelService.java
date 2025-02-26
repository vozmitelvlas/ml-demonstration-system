package ru.etu.mldemonstrationapp.mainservice.models;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;
import ru.etu.mldemonstrationapp.mainservice.users.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModelService {
    private final UserRepository userRepository;
    private final ModelRepository modelRepository;
    private final ModelVersionRepository modelVersionRepository;

    public List<Model> getAvailableModels(Long userId) {
        Organization organization = userRepository.findById(userId).orElseThrow().getOrganization();
        return modelRepository.findAllByOrganization(organization);
    }

    public Model getModelById(Long id, Long userId) {
        Organization organization = userRepository.findById(userId).orElseThrow().getOrganization();
        return modelRepository.findByIdAndOrganization(id, organization).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));
    }

    public ModelVersion getModelVersionById(Long id, Long userId) {
        Organization organization = userRepository.findById(userId).orElseThrow().getOrganization();
        return modelVersionRepository.findByIdAndOrganization(id, organization).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Model version not found"));
    }

    public List<ModelVersion> getAvailableModelsVersions(Long userId) {
        Organization organization = userRepository.findById(userId).orElseThrow().getOrganization();
        return modelVersionRepository.findAllByOrganization(organization);
    }
}

