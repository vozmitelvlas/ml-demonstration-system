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
import java.io.*;
import java.util.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/triton-models")
public class TritonModelController {

    private final TritonModelService tritonModelService;
    private final RestTemplate restTemplate = new RestTemplate();

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
                result = inferFromPythonWav2Vec(file);
                Object transcription = result.get("transcription");
                return ResponseEntity.ok(transcription != null ? transcription.toString() : "");
            } else if ("unet_signal_processing".equals(modelName)) {
                log.info("Проверяем модель: {}", modelName);
                result = inferFromPythonUnet(file);
                // Если есть изображение — отправляем его
                if (result.containsKey("image")) {
                    return ResponseEntity.ok(Map.of("image", result.get("image")));
                }
            }else {
                Map<String, Object> inputs = preprocessInput(file, modelName);
                result = tritonModelService.infer(inputs, modelName);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap(
                    "error", "Ошибка при выполнении инференса: " + e.getMessage()
            ));
        }
    }

    // Предобработка входного файла под модель
    private Map<String, Object> preprocessInput(MultipartFile file, String modelName) throws Exception {
        String originalFilename = file.getOriginalFilename();
        if (modelName.equals("tinycov_model") || modelName.equals("unet_signal_processing")) {
            if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".csv")) {
                throw new IllegalArgumentException("Для модели " + modelName + " требуется .csv файл");
            }
            return processCSV(file.getInputStream(), modelName);
        } else if (modelName.equals("wav2vec2")) {
            if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".wav")) {
                throw new IllegalArgumentException("Для модели wav2vec2 требуется .wav файл");
            }
            return tritonModelService.processWAV(file.getBytes());
        } else {
            throw new IllegalArgumentException("Неизвестная модель: " + modelName);
        }
    }

    // Чтение CSV (для TinyConv и U-Net)
    private Map<String, Object> processCSV(InputStream inputStream, String modelName) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        List<Double> values = new ArrayList<>();
        String line;
        while ((line = reader.readLine()) != null) {
            try {
                double val = Double.parseDouble(line.trim());
                values.add(val);
            } catch (NumberFormatException ignored) {}
        }

        int expectedLength;
        if (modelName.equals("tinycov_model")) {
            expectedLength = 64;
        } else {
            expectedLength = 1024;
        }

        if (values.size() != expectedLength) {
            throw new IllegalArgumentException("Ожидалось " + expectedLength + " значений, получено: " + values.size());
        }

        double[][][] inputTensor = new double[1][1][expectedLength];
        for (int i = 0; i < expectedLength; i++) {
            inputTensor[0][0][i] = values.get(i);
        }

        return Map.of("input", inputTensor);
    }

    // Отправляем WAV-файл на Python-микросервис
    private Map<String, Object> inferFromPythonWav2Vec(MultipartFile file) {
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

    private Map<String, Object> inferFromPythonUnet(MultipartFile file) {
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
}