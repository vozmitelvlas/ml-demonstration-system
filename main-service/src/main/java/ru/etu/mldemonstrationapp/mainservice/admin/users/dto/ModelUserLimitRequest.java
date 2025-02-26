package ru.etu.mldemonstrationapp.mainservice.admin.users.dto;

import ru.etu.mldemonstrationapp.mainservice.users.ModelUserLimit;
import jakarta.validation.constraints.NotNull;

public record ModelUserLimitRequest(
    @NotNull(message = "Model ID cannot be null")
    Long modelId,

    @NotNull(message = "Limit cannot be null")
    ModelUserLimit limit
) {}
