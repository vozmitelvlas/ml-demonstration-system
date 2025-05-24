package ru.etu.mldemonstrationapp.mainservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import ru.etu.mldemonstrationapp.mainservice.service.TritonModelService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import java.util.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/triton-models")
public class TritonModelController {

    private final TritonModelService tritonModelService;
    @Autowired
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

    // Выполнить инференс через загрузку файла
    @PostMapping(path = "/infer", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> infer(
            @RequestPart("file") MultipartFile file,
            @RequestParam("model") String modelName) {
        try {
            if (!tritonModelService.isModelLoaded(modelName)) {
                return ResponseEntity.status(400).body(Collections.singletonMap(
                        "error", "Модель '" + modelName + "' не загружена."
                ));
            }

            Map<String, Object> result;

            if ("wav2vec2".equals(modelName)) {
                result = tritonModelService.inferFromPythonWav2Vec(file);
                Object transcription = result.get("transcription");
                return ResponseEntity.ok(transcription != null ? transcription.toString() : "");
            } else if ("unet_signal_processing".equals(modelName)) {
                log.info("Проверяем модель: {}", modelName);
                result = tritonModelService.inferFromPythonUnet(file);
                // Если есть изображение — отправляем его
                if (result.containsKey("image")) {
                    return ResponseEntity.ok(Map.of("image", result.get("image")));
                }
            }else if ("tinycov_model".equals(modelName)) {
                log.info("Проверяем модель: {}", modelName);
                result = tritonModelService.inferFromPythonTinyConv(file);
                // Если есть результаты классификации — отправляем их
                if (result.containsKey("predictions")) {
                    return ResponseEntity.ok(Map.of(
                            "predictions", result.get("predictions")
                    ));
                }
            }else {
                // Если модель не поддерживается ни одним из микросервисов
                return ResponseEntity.status(400).body(Collections.singletonMap(
                        "error", "Модель '" + modelName + "' не обслуживается."
                ));
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap(
                    "error", "Ошибка при выполнении инференса: " + e.getMessage()
            ));
        }
    }
}