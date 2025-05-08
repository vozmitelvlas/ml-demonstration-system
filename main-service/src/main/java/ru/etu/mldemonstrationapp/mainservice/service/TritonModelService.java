package ru.etu.mldemonstrationapp.mainservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class TritonModelService {

    private final HttpClient availabilityClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    private final HttpClient inferenceClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final List<String> knownModels = Arrays.asList(
        "tinycov_model",
        "unet_signal_processing",
        "wav2vec2"
    );

    private static final String TRITON_BASE_URL = "http://localhost:8000/v2/models";

    // Проверяет, загружена ли модель в Triton
    public boolean isModelLoaded(String modelName) {
        try {
            String url = TRITON_BASE_URL + "/" + modelName;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();

            HttpResponse<Void> response = availabilityClient.send(request, HttpResponse.BodyHandlers.discarding());
            return response.statusCode() == 200;

        } catch (Exception e) {
            return false;
        }
    }

    // Возвращает список только доступных моделей
    public List<String> getAvailableModels() {
        return knownModels.stream()
                .filter(this::isModelLoaded)
                .toList();
    }

    // Выполняет инференс для указанной модели
    public Map<String, Object> infer(Map<String, Object> inputs, String modelName) throws Exception {
        String modelUrl = TRITON_BASE_URL + "/" + modelName + "/infer";

        Map<String, Object> payload = new HashMap<>();
        payload.put("inputs", inputs);

        String jsonBody = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(modelUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(Duration.ofSeconds(15))
                .build();

        HttpResponse<String> response = inferenceClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Ошибка при выполнении инференса. Код: " + response.statusCode());
        }

        return objectMapper.readValue(response.body(), Map.class);
    }
}