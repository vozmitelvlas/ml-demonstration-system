package ru.etu.mldemonstrationapp.mainservice.models;

import lombok.RequiredArgsConstructor;
import ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
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