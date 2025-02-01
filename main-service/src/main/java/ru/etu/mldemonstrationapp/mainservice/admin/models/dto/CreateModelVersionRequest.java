package ru.etu.mldemonstrationapp.mainservice.admin.models.dto;

public record CreateModelVersionRequest(
        String versionName,
        String uri,
        String description
) {
}
