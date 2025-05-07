package ru.etu.mldemonstrationapp.mainservice.service;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Arrays;

@Service
public class ModelAvailabilityService {

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(3))
            .build();


    private final List<String> knownModels = Arrays.asList(
        "tinycov_model",
        "unet_signal_processing",
        "wav2vec2"
    );

    public List<String> getAvailableModels() {
        return knownModels.stream()
                .filter(this::isModelLoaded)
                .collect(Collectors.toList());
    }

    private boolean isModelLoaded(String modelName) {
        try {
            String url = "http://localhost:8000/v2/models/" + modelName;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();

            HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());

            return response.statusCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }
}