package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelProblemType;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelRuntime;

public record UpdateModelVersionRequest(
        @NotNull(message = "Model name cannot be null")
        @Size(min = 1, max = 255, message = "Model name must be between 1 and 255 characters")
        String modelName,

        @NotNull(message = "Version name cannot be null")
        @Size(min = 1, max = 255, message = "Version name must be between 1 and 255 characters")
        String versionName,

        @Size(max = 500, message = "Description cannot exceed 500 characters")
        String description,

        @URL(message = "Invalid URI format")
        @Size(max = 255, message = "URI cannot exceed 255 characters")
        String uri,

        @NotNull(message = "Runtime cannot be null")
        ModelRuntime runtime,

        @NotNull(message = "Problem type cannot be null")
        ModelProblemType problemType
) {
}
