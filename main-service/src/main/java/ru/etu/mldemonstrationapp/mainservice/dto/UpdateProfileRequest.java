package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "First name cannot be blank")
        @Size(min = 1, max = 255, message = "First name name must be between 1 and 255 characters")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        @Size(min = 1, max = 255, message = "Last name name must be between 1 and 255 characters")
        String lastName,

        @Size(max = 255, message = "Patronymic cannot exceed 255 characters")
        String patronymic,

        @Size(max = 500, message = "Description cannot exceed 500 characters")
        String description
) {}