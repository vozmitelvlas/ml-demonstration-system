package ru.etu.mldemonstrationapp.mainservice.users.dto;

import jakarta.validation.constraints.NotNull;

public record ModelUserLimitRequest(
    @NotNull(message = "Model ID cannot be null")
    Long modelId,

    @NotNull(message = "Limit ID cannot be null")
    Long limitId,

    @NotNull(message = "User ID cannot be null")
    Long userId
) {}
