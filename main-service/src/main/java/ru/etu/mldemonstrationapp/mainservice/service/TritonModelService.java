package ru.etu.mldemonstrationapp.mainservice.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.etu.mldemonstrationapp.mainservice.configuration.TritonProperties;

import java.util.*;

@Service
public class TritonModelService {

    public final RestTemplate restTemplate = new RestTemplate();
    public final TritonProperties tritonProperties;

    public TritonModelService(TritonProperties tritonProperties) {
        this.tritonProperties = tritonProperties;
    }

    // Проверяет, загружена ли модель
    public boolean isModelLoaded(String modelName) {
        String url = tritonProperties.getUrl() + "/" + modelName;
        System.out.println("Проверяем модель: " + modelName);
        System.out.println("URL запроса: " + url);

        try {
            String response = restTemplate.getForObject(url, String.class);
            return response != null && !response.isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Возвращает список доступных моделей
    public List<String> getAvailableModels() {
        return tritonProperties.getKnownModels().stream()
                .filter(this::isModelLoaded)
                .toList();
    }

    // Выполняет инференс
    public Map<String, Object> infer(Map<String, Object> inputs, String modelName) throws Exception {
        String modelUrl = tritonProperties.getUrl() + "/" + modelName + "/infer";

        Map<String, Object> payload = Map.of("inputs", inputs);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(modelUrl, payload, Map.class);
            if (response == null) {
                throw new Exception("Пустой ответ от сервера");
            }
            return response;
        } catch (Exception e) {
            throw new Exception("Ошибка при выполнении инференса: " + e.getMessage());
        }
    }
}