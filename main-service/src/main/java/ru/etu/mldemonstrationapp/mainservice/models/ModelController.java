package ru.etu.mldemonstrationapp.mainservice.models;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse;

import java.util.List;

@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class ModelController {
    private final ModelService modelService;

    @GetMapping
    public ResponseEntity<List<Model>> getAllModels() {
        return ResponseEntity.ok(modelService.getAllModels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Model> getModelById(@PathVariable Long id) {
        return ResponseEntity.ok(modelService.getModelById(id));
    }

    @GetMapping("/versions/{id}")
    public ResponseEntity<ModelVersionResponse> getModelVersionById(@PathVariable Long id) {
        return ResponseEntity.ok(modelService.getModelVersionById(id));
    }

    @GetMapping("/versions")
    public ResponseEntity<List<ModelVersionResponse>> getAllModelVersions() {
        return ResponseEntity.ok(modelService.getAllModelVersions());
    }
}