package ru.etu.mldemonstrationapp.mainservice.models;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.etu.mldemonstrationapp.mainservice.models.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.models.dto.UpdateModelRequest;

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

    @PostMapping
    public ResponseEntity<Model> createModel(@RequestBody CreateModelRequest request) {
        return ResponseEntity.ok(modelService.createModel(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Model> updateModel(@PathVariable Long id, @RequestBody UpdateModelRequest request) {
        return ResponseEntity.ok(modelService.updateModel(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModel(@PathVariable Long id) {
        modelService.deleteModel(id);
        return ResponseEntity.noContent().build();
    }
}