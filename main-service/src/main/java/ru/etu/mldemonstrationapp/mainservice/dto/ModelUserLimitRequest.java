package ru.etu.mldemonstrationapp.mainservice.dto;

import ru.etu.mldemonstrationapp.mainservice.entity.ModelUserLimit;
import jakarta.validation.constraints.NotNull;

public record ModelUserLimitRequest(
    @NotNull(message = "Model ID cannot be null")
    Long modelId,

    @NotNull(message = "Limit cannot be null")
    ModelUserLimit limit
) {}
