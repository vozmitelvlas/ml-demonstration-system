package ru.etu.mldemonstrationapp.mainservice.service;

import lombok.extern.slf4j.Slf4j;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import ru.etu.mldemonstrationapp.mainservice.configuration.TritonProperties;
import java.util.*;

@Slf4j
@Service
public class TritonModelService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final TritonProperties tritonProperties;

    public TritonModelService(TritonProperties tritonProperties) {
        this.tritonProperties = tritonProperties;
    }

    // Проверяет, загружена ли модель
    public boolean isModelLoaded(String modelName) {
        String url = tritonProperties.getUrl() + "/" + modelName;
        log.info("Проверяем модель: {}", modelName);
        log.debug("URL запроса: {}", url);
        try {
            String response = restTemplate.getForObject(url, String.class);
            return response != null && !response.isEmpty();
        } catch (Exception e) {
            log.error("Модель '{}' не доступна: {}", modelName, e.getMessage());
            return false;
        }
    }

    // Возвращает список доступных моделей
    public List<String> getAvailableModels() {
        return tritonProperties.getKnownModels().stream()
                .filter(this::isModelLoaded)
                .toList();
    }

    // Отправляем WAV-файл на Python-микросервис
    public Map<String, Object> inferFromPythonWav2Vec(MultipartFile file) {
        String pythonServiceUrl = "http://python-wav2vec2:5000/wav2vec2/infer";

        try {
            // Создаем multipart/form-data запрос
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("audio_file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(pythonServiceUrl, requestEntity, Map.class);

            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при вызове Python-микросервиса: " + e.getMessage());
        }
    }

    public Map<String, Object> inferFromPythonUnet(MultipartFile file) {
        String pythonServiceUrl = "http://python-unet:5100/unet/infer";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("csv_file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(pythonServiceUrl, requestEntity, Map.class);
    
            // Получаем ответ
            Map<String, Object> responseBody = response.getBody();
    
            // Проверяем, есть ли изображение
            if (responseBody != null && responseBody.containsKey("original_signal") && responseBody.containsKey("predicted_signal")) {
                // Можно сохранить в бд или вернуть клиенту
                return responseBody;
            } else {
                throw new RuntimeException("Ответ не содержит изображений");
            }
    
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при вызове Python-микросервиса U-Net: " + e.getMessage());
        }
    }

    public Map<String, Object> inferFromPythonTinyConv(MultipartFile file) {
        String pythonServiceUrl = "http://python-tinyconv:5200/tinyconv/infer";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("csv_file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(pythonServiceUrl, requestEntity, Map.class);

            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при вызове Python-микросервиса TinyConv: " + e.getMessage());
        }
    }
}