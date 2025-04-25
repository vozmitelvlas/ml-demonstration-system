package ru.etu.mldemonstrationapp.mainservice.dto;

import lombok.Data;

@Data
public class AudioTranscriptionResponse {
    private String transcription; // Транскрипция текста

    // Конструктор по умолчанию (необходим для сериализации/десериализации)
    public AudioTranscriptionResponse() {}

    // Конструктор с параметром
    public AudioTranscriptionResponse(String transcription) {
        this.transcription = transcription;
    }
}