package ru.etu.mldemonstrationapp.mainservice.organizations.dto;

import jakarta.validation.constraints.NotNull;
import ru.etu.mldemonstrationapp.mainservice.organizations.OrganizationLimitsType;

public record UpdateLimitsTypeRequest(
        @NotNull(message = "limitsType must be not null")
        OrganizationLimitsType limitsType
) {
}
