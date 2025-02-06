package ru.etu.mldemonstrationapp.mainservice.models.dto;

import ru.etu.mldemonstrationapp.mainservice.models.Limit;
import ru.etu.mldemonstrationapp.mainservice.models.ModelInfo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record ModelVersionResponse(
        @NotNull(message = "Model ID cannot be null")
        Long modelId,

        @NotBlank(message = "Model name cannot be empty")
        String modelName,

        @NotNull(message = "Model version ID cannot be null")
        Long modelVersionId,

        @NotBlank(message = "Version name cannot be empty")
        String versionName,

        String description,
        String uri,

        @NotNull(message = "Model Info cannot be null")
        ModelInfo modelInfo,

        @NotNull(message = "Limit cannot be null")
        Limit limit,

        @NotNull(message = "Updated at timestamp cannot be null")
        Instant updatedAt,

        @NotNull(message = "Created at timestamp cannot be null")
        Instant createdAt
) {}

