package ru.etu.mldemonstrationapp.mainservice.dto;

import ru.etu.mldemonstrationapp.mainservice.entity.Limit;

public record ModelOrganizationLimitResponse(Limit limit, Long modelId, String modelName, String href) {
}
