package ru.etu.mldemonstrationapp.mainservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.stereotype.Service;
import ru.etu.mldemonstrationapp.mainservice.dto.AudioTranscriptionResponse;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class TritonService {

    private final OkHttpClient httpClient = new OkHttpClient();

    // Путь к директории с моделями (если используется файловая система)
    private static final String MODELS_DIR = "models/model_repository";

    /**
     * Транскрибирование аудио через Triton Inference Server.
     */
    public AudioTranscriptionResponse transcribeAudio(byte[] audioData) throws IOException {
        // Преобразование байтового массива аудио в формат, подходящий для модели
        String jsonBody = """
                {
                  "inputs": [
                    {
                      "name": "audio_input",
                      "shape": [1, %d],
                      "datatype": "FP32",
                      "data": %s
                    }
                  ]
                }
                """.formatted(audioData.length, convertToFloatArray(audioData));

        // Отправка запроса в Triton
        Request request = new Request.Builder()
                .url("http://localhost:8000/v2/models/wav2vec2/infer")
                .post(RequestBody.create(jsonBody, MediaType.get("application/json")))
                .build();

        Response response = httpClient.newCall(request).execute();
        if (response.isSuccessful()) {
            String responseBody = response.body().string();
            return new AudioTranscriptionResponse(extractTranscriptionFromResponse(responseBody));
        } else {
            throw new RuntimeException("Error processing audio: " + response.code());
        }
    }

    /**
     * Получение списка всех доступных моделей.
     */
    public List<String> getAllModels() {
        File modelsDirectory = new File(MODELS_DIR);
        if (!modelsDirectory.exists() || !modelsDirectory.isDirectory()) {
            throw new RuntimeException("Models directory not found");
        }

        // Получаем список поддиректорий (каждая поддиректория — это модель)
        File[] modelDirs = modelsDirectory.listFiles(File::isDirectory);
        if (modelDirs == null) {
            return new ArrayList<>();
        }

        List<String> models = new ArrayList<>();
        for (File modelDir : modelDirs) {
            models.add(modelDir.getName());
        }
        return models;
    }

    /**
     * Получение статуса конкретной модели.
     */
    public String getModelStatus(String modelName) throws IOException {
        Request request = new Request.Builder()
                .url("http://localhost:8000/v2/models/" + modelName)
                .get()
                .build();

        Response response = httpClient.newCall(request).execute();
        if (response.isSuccessful()) {
            return response.body().string();
        } else if (response.code() == 404) {
            throw new RuntimeException("Model not found: " + modelName);
        } else {
            throw new RuntimeException("Error retrieving model status: " + response.code());
        }
    }

    /**
     * Преобразование байтов в массив чисел с плавающей точкой.
     */
    private String convertToFloatArray(byte[] bytes) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < bytes.length; i++) {
            sb.append((bytes[i] & 0xFF) / 255.0); // Нормализация значений
            if (i < bytes.length - 1) sb.append(", ");
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Извлечение транскрипции из JSON-ответа Triton.
     */
    private String extractTranscriptionFromResponse(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            return rootNode.path("outputs").path(0).path("data").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error parsing response";
        }
    }
}