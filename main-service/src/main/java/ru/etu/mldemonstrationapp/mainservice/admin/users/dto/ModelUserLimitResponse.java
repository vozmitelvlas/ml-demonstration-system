package ru.etu.mldemonstrationapp.mainservice.users.dto;

import ru.etu.mldemonstrationapp.mainservice.models.Limit;

public record ModelUserLimitResponse(Limit limit, Long modelId, String modelName, String href) {
}
