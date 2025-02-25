package ru.etu.mldemonstrationapp.mainservice.users.dto;

import ru.etu.mldemonstrationapp.mainservice.users.ModelUserLimit;
import jakarta.validation.constraints.NotNull;

public record ModelUserLimitRequest(
    @NotNull(message = "Model ID cannot be null")
    Long modelId,

    ModelUserLimit limit
) {}
