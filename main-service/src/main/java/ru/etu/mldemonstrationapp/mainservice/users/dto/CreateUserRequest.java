package ru.etu.mldemonstrationapp.mainservice.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "Login cannot be blank")
        @Size(min = 3, max = 50, message = "Login must be between 3 and 50 characters")
        String login,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6, message = "Password must be at least 6 characters long")
        String password,

        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "First name cannot be blank")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        String lastName,

        String patronymic,
        String description
) {}