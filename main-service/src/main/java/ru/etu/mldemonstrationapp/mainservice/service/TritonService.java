package ru.etu.mldemonstrationapp.mainservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.HashMap;

@Service
public class TritonService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(5))
            .build();

    private String tritonUrl = "http://localhost:8000/v2/models";

    public Map<String, Object> infer(Map<String, Object> inputs, String modelName) throws Exception {
        String modelUrl = tritonUrl + "/" + modelName + "/infer";

        // Формируем тело запроса в формате Triton REST API
        Map<String, Object> payload = new HashMap<>();
        payload.put("inputs", inputs);

        String jsonBody = objectMapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(modelUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(Duration.ofSeconds(15))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new Exception("Ошибка при выполнении инференса. Код: " + response.statusCode());
        }

        // Парсим JSON-ответ от Triton
        return objectMapper.readValue(response.body(), Map.class);
    }
}