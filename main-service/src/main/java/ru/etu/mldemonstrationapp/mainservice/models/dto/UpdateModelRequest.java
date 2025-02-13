package ru.etu.mldemonstrationapp.mainservice.models.dto;

import ru.etu.mldemonstrationapp.mainservice.models.ModelInfo;
import ru.etu.mldemonstrationapp.mainservice.models.Limit;

public record UpdateModelRequest(String name, ModelInfo modelInfo, Limit limit) {}
