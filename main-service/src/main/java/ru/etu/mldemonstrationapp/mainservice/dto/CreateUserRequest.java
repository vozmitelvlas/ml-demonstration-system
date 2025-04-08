package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateUserRequest(
        @NotBlank(message = "Login cannot be empty")
        @Size(min = 3, max = 50, message = "Login must be between 3 and 50 characters")
        String login,

        @NotBlank(message = "Password cannot be empty")
        @Size(min = 6, max = 255, message = "Password must be between 6 and 255 characters")
        String password,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email cannot be empty")
        String email,

        @NotBlank(message = "First name cannot be blank")
        @Size(min = 1, max = 255, message = "First name name must be between 1 and 255 characters")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        @Size(min = 1, max = 255, message = "Last name name must be between 1 and 255 characters")
        String lastName,

        @Size(max = 255, message = "Patronymic should not exceed 50 characters")
        String patronymic,

        @Size(max = 500, message = "Description should not exceed 500 characters")
        String description,

        @NotNull(message = "OrganizationId must not be null")
        Long organizationId,

        @NotNull(message = "emailConfirm must not be null")
        Boolean emailConfirm,

        @NotNull(message = "Roles must not be null")
        @Size(min = 1, max = 3)
        List<String> roles,

        @NotNull(message = "Active must not be null")
        Boolean active
) {}
