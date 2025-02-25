package ru.etu.mldemonstrationapp.mainservice.organizations.dto;

import jakarta.validation.constraints.NotNull;
import ru.etu.mldemonstrationapp.mainservice.organizations.ModelOrganizationLimit;

public record ModelOrganizationLimitRequest (
    @NotNull(message = "Model ID cannot be null")
    Long modelId,

    ModelOrganizationLimit limit
){}
