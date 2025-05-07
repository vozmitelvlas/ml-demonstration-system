package ru.etu.mldemonstrationapp.mainservice.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import ru.etu.mldemonstrationapp.mainservice.dto.TritonInferenceRequest;
import ru.etu.mldemonstrationapp.mainservice.service.TritonService;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/triton-models")
public class TritonModelController {

    private final TritonService inferenceService;
    private final HttpClient httpClient = HttpClient.newHttpClient(); // Объявлен здесь

    public TritonModelController(TritonService inferenceService) {
        this.inferenceService = inferenceService;
    }

    // GET /api/models/{modelName} — Получение метаданных модели от Triton
    @GetMapping("/{modelName}")
    public ResponseEntity<String> getModelMetadata(@PathVariable String modelName) throws Exception {
        String tritonUrl = "http://localhost:8000/v2/models/" + modelName;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tritonUrl))
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        return ResponseEntity.status(response.statusCode()).body(response.body());
    }

    // POST /api/models/infer — Отправка данных на модель
    @PostMapping("/infer")
    public Map<String, Object> infer(@RequestBody TritonInferenceRequest request) {
        try {
            return inferenceService.infer(request.getInputs(), request.getModelName());
        } catch (Exception e) {
            return Collections.singletonMap("error", (Object)"Ошибка сервера: " + e.getMessage());
        }
    }
}