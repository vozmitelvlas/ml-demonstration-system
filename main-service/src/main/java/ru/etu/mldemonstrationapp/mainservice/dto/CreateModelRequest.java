package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelProblemType;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelRuntime;

public record CreateModelRequest(
        @NotNull(message = "Model name cannot be null")
        @Size(min = 1, max = 255, message = "Model name must be between 1 and 255 characters")
        String name,

        @NotNull(message = "URI cannot be null")
        @URL(message = "Invalid URI format")
        @Size(min = 1, max = 255, message = "URI must be between 1 and 255 characters")
        String uri,

        @Size(max = 500, message = "Description cannot exceed 500 characters")
        String description,

        @NotNull(message = "Problem type cannot be null")
        ModelProblemType problemType,

        @NotNull(message = "Runtime cannot be null")
        ModelRuntime runtime
) {
}
