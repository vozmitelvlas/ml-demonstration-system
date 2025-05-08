package ru.etu.mldemonstrationapp.mainservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.etu.mldemonstrationapp.mainservice.dto.TritonInferenceRequest;
import ru.etu.mldemonstrationapp.mainservice.service.TritonModelService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/triton-models")
public class TritonModelController {

    private final TritonModelService tritonModelService;

    public TritonModelController(TritonModelService tritonModelService) {
        this.tritonModelService = tritonModelService;
    }

    // Проверка доступности Triton
    @GetMapping("/health")
    public ResponseEntity<String> checkTritonHealth() {
        boolean loaded = tritonModelService.isModelLoaded("wav2vec2");
        return loaded ? ResponseEntity.ok("OK") : ResponseEntity.status(503).body("Triton недоступен");
    }

    // Получить список доступных моделей
    @GetMapping("/available")
    public ResponseEntity<List<String>> getAvailableModels() {
        List<String> availableModels = tritonModelService.getAvailableModels();
        return ResponseEntity.ok(availableModels);
    }

    // Выполнить инференс
    @PostMapping("/infer")
    public ResponseEntity<?> infer(@RequestBody TritonInferenceRequest request) {
        try {
            String modelName = request.getModelName();

            if (!tritonModelService.isModelLoaded(modelName)) {
                return ResponseEntity.status(400).body(Collections.singletonMap(
                        "error", "Модель '" + modelName + "' не загружена."
                ));
            }

            Map<String, Object> result = tritonModelService.infer(request.getInputs(), modelName);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap(
                    "error", "Ошибка при выполнении инференса: " + e.getMessage()
            ));
        }
    }

    // Получить метаданные модели
    @GetMapping("/{modelName}")
    public ResponseEntity<?> getModelMetadata(@PathVariable String modelName) {
        String url = tritonModelService.tritonProperties.getUrl() + "/" + modelName;

        try {
            String response = tritonModelService.restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap(
                    "error", "Ошибка получения метаданных: " + e.getMessage()
            ));
        }
    }
}