package ru.etu.mldemonstrationapp.mainservice.dto;

import lombok.Data;

@Data
public class AudioTranscriptionRequest {
    private byte[] audioData; // Данные аудиофайла
}