package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateOrganizationRequest(
        @NotBlank(message = "Name cannot be blank")
        @Size(min = 4, max = 255, message = "Name must be between 4 and 255 characters")
        String name,

        @Size(max = 500, message = "Description cannot exceed 500 characters")
        String description
) {
}
