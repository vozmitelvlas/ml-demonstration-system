package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotNull;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelOrganizationLimit;

public record ModelOrganizationLimitRequest (
    @NotNull(message = "Model ID cannot be null")
    Long modelId,

    ModelOrganizationLimit limit
){}
