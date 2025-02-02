package ru.etu.mldemonstrationapp.mainservice.admin.models.dto;

public record UpdateModelVersionRequest(
        String modelName,
        String versionName,
        String description,
        String uri,
        String runtime,
        String problemType
) {
}
