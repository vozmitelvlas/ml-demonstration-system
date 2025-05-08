package ru.etu.mldemonstrationapp.mainservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.etu.mldemonstrationapp.mainservice.service.TritonModelService;

import javax.sound.sampled.*;
import java.io.*;
import java.util.*;

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

            Map<String, Object> inputs = preprocessInput(file, modelName);

            Map<String, Object> result = tritonModelService.infer(inputs, modelName);
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
            return processWAV(file.getBytes());
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

    // WAV → float array (для Wav2Vec2), с конвертацией в моно, 16 бит, 16 кГц
    private Map<String, Object> processWAV(byte[] wavBytes) throws Exception {
        ByteArrayInputStream bis = new ByteArrayInputStream(wavBytes);
        AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(bis);

        AudioFormat sourceFormat = audioInputStream.getFormat();
        System.out.println("Исходный формат: " + sourceFormat);

        // Целевой формат: PCM_SIGNED, 16 бит, 16 кГц, моно
        AudioFormat targetFormat = new AudioFormat(
                AudioFormat.Encoding.PCM_SIGNED,
                16000,
                16,
                1,
                2,
                16000,
                false
        );

        AudioInputStream convertedStream = AudioSystem.getAudioInputStream(targetFormat, audioInputStream);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int bytesRead;
        while ((bytesRead = convertedStream.read(buffer)) != -1) {
            byteArrayOutputStream.write(buffer, 0, bytesRead);
        }

        byte[] pcmData = byteArrayOutputStream.toByteArray();

        // Преобразуем в double[]
        double[] signal = new double[pcmData.length / 2]; // 2 байта на семпл
        for (int i = 0; i < signal.length; i++) {
            int low = pcmData[2 * i] & 0xFF;
            int high = pcmData[2 * i + 1] & 0xFF;
            short sample = (short) (low | (high << 8));
            signal[i] = sample / 32768.0; // Нормализация [-1.0, 1.0]
        }

        return Map.of("input", signal);
    }
}