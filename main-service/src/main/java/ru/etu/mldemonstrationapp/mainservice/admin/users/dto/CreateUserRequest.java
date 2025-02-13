package ru.etu.mldemonstrationapp.mainservice.admin.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateUserRequest(
        @NotBlank(message = "Login cannot be empty")
        @Size(min = 3, max = 50, message = "Login must be between 3 and 50 characters")
        String login,

        @NotBlank(message = "Password cannot be empty")
        @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
        String password,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email cannot be empty")
        String email,

        @NotBlank(message = "First name cannot be empty")
        @Size(max = 50, message = "First name should not exceed 50 characters")
        String firstName,

        @NotBlank(message = "Last name cannot be empty")
        @Size(max = 50, message = "Last name should not exceed 50 characters")
        String lastName,

        @Size(max = 50, message = "Patronymic should not exceed 50 characters")
        String patronymic,

        @Size(max = 200, message = "Description should not exceed 200 characters")
        String description,

        Long organizationId,

        List<String> roles
) {}
