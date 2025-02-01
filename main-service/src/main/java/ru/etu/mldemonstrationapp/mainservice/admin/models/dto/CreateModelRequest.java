package ru.etu.mldemonstrationapp.mainservice.admin.models.dto;

public record CreateModelRequest(
        String name,
        String uri,
        String description,
        String problemType,
        String runtime
) {
}
