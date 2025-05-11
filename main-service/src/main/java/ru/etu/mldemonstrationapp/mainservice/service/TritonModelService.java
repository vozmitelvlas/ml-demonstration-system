package ru.etu.mldemonstrationapp.mainservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.etu.mldemonstrationapp.mainservice.configuration.TritonProperties;

import java.io.ByteArrayOutputStream;
import javax.sound.sampled.*;
import java.io.ByteArrayInputStream;
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

    // WAV → float[]
    public Map<String, Object> processWAV(byte[] wavBytes) throws Exception {
        ByteArrayInputStream bis = new ByteArrayInputStream(wavBytes);
        AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(bis);
        AudioFormat sourceFormat = audioInputStream.getFormat();

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
        float[] signal = new float[pcmData.length / 2];

        for (int i = 0; i < signal.length; i++) {
            int low = pcmData[2 * i] & 0xFF;
            int high = pcmData[2 * i + 1] & 0xFF;
            short sample = (short) (low | (high << 8));
            signal[i] = sample / 32768.0f; // [-1.0, 1.0]
        }

        return Map.of(
                "name", "input",
                "shape", new int[]{1, signal.length},
                "datatype", "FP32",
                "data", signal
        );
    }
}