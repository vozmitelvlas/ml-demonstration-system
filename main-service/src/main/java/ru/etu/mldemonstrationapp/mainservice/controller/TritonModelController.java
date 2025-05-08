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

    // Получить список известных моделей, доступных в данный момент
    @GetMapping("/available")
    public ResponseEntity<List<String>> getAvailableModels() {
        List<String> availableModels = tritonModelService.getAvailableModels();
        return ResponseEntity.ok(availableModels);
    }

    // Выполнить инференс для указанной модели
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

    // Дополнительно: получить метаданные конкретной модели из Triton
    @GetMapping("/{modelName}")
    public ResponseEntity<?> getModelMetadata(@PathVariable String modelName) {
        try {
            String url = "http://localhost:8000/v2/models/" + modelName;

            var client = java.net.http.HttpClient.newHttpClient();
            var request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(url))
                    .GET()
                    .build();

            var response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());

            return ResponseEntity.status(response.statusCode()).body(response.body());

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap(
                    "error", "Ошибка получения метаданных: " + e.getMessage()
            ));
        }
    }
}