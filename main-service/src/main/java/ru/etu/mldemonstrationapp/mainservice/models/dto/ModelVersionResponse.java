package ru.etu.mldemonstrationapp.mainservice.models.dto;

import ru.etu.mldemonstrationapp.mainservice.models.Limit;
import ru.etu.mldemonstrationapp.mainservice.models.ModelInfo;

import java.time.Instant;

public record ModelVersionResponse(
        Long modelId,
        String modelName,
        Long modelVersionId,
        String versionName,
        String description,
        String uri,
        ModelInfo modelInfo,
        Limit limit,
        Instant updatedAt,
        Instant createdAt
) {}

