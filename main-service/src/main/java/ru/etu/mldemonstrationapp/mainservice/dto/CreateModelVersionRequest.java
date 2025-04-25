package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateModelVersionRequest(
        @NotNull(message = "Version name cannot be null")
        @Size(min = 1, max = 255, message = "Version name must be between 1 and 255 characters")
        String versionName,

        @Size(max = 255, message = "URI cannot exceed 255 characters")
        String uri,

        @Size(max = 500, message = "Description cannot exceed 500 characters")
        String description
) {
}
