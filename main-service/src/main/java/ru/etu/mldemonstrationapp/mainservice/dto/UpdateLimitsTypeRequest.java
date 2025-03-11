package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotNull;
import ru.etu.mldemonstrationapp.mainservice.entity.OrganizationLimitsType;

public record UpdateLimitsTypeRequest(
        @NotNull(message = "limitsType must be not null")
        OrganizationLimitsType limitsType
) {
}
