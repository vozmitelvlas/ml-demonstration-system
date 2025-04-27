package ru.etu.mldemonstrationapp.mainservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.etu.mldemonstrationapp.mainservice.dto.AudioTranscriptionResponse;
import ru.etu.mldemonstrationapp.mainservice.service.TritonService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/inference")
public class TritonInferenceController {

    private final TritonService tritonService;

    public TritonInferenceController(TritonService tritonService) {
        this.tritonService = tritonService;
    }

    @PostMapping("/transcribe")
    public ResponseEntity<AudioTranscriptionResponse> transcribeAudio(@RequestParam("file") MultipartFile file) {
        try {
            byte[] audioBytes = file.getBytes();
            AudioTranscriptionResponse response = tritonService.transcribeAudio(audioBytes);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new AudioTranscriptionResponse("Error processing audio"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new AudioTranscriptionResponse("Server error"));
        }
    }

    // Эндпоинт для получения списка всех моделей
    @GetMapping("/models")
    public ResponseEntity<List<String>> getAllModels() {
        try {
            List<String> models = tritonService.getAllModels();
            return ResponseEntity.ok(models);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Эндпоинт для проверки статуса конкретной модели
    @GetMapping("/models/{modelName}")
    public ResponseEntity<String> getModelStatus(@PathVariable String modelName) {
        try {
            String status = tritonService.getModelStatus(modelName);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error retrieving model status");
        }
    }
}