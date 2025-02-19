package ru.etu.mldemonstrationapp.mainservice.organizations.dto;

import ru.etu.mldemonstrationapp.mainservice.models.Limit;

public record ModelOrganizationLimitResponse(Limit limit, Long modelId, String modelName, String href) {
}
