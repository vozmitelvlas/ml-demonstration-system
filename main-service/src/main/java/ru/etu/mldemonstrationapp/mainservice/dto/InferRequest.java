package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record InferRequest(@NotNull(message = "Model version id must be specified") Long modelVersionId,
                           Map<String, String> parameters) {

}
