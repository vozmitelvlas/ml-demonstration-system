package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UpdateUserRequest(
        @NotBlank(message = "First name cannot be blank")
        @Size(min = 1, max = 255, message = "First name name must be between 1 and 255 characters")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        @Size(min = 1, max = 255, message = "Last name name must be between 1 and 255 characters")
        String lastName,

        @Size(max = 500, message = "Description should not exceed 500 characters")
        String description,

        @Size(max = 255, message = "Patronymic should not exceed 255 characters")
        String patronymic,

        @NotNull(message = "Organization id cannot be null")
        Long organizationId,

        @NotNull(message = "Roles must not be null")
        @Size(min = 1, max = 3)
        List<String> roles
) {
}
