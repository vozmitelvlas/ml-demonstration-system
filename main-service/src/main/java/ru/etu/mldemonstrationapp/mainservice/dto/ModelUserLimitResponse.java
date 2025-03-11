package ru.etu.mldemonstrationapp.mainservice.dto;

import ru.etu.mldemonstrationapp.mainservice.entity.Limit;
import ru.etu.mldemonstrationapp.mainservice.entity.Model;

public record ModelUserLimitResponse(Limit limit, Long modelId, String modelName, String href) {
    public static ModelUserLimitResponse fromLimitAndModel(Limit limit, Model model) {
        return new ModelUserLimitResponse(
                limit,
                model.getModelId(),
                model.getName(),
                "/api/models/" + model.getModelId()
        );
    }


}
