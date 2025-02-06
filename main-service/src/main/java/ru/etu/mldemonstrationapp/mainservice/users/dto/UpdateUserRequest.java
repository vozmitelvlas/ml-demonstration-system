package ru.etu.mldemonstrationapp.mainservice.users.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
        @NotBlank(message = "First name cannot be blank")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        String lastName,

        String patronymic,
        String description
) {}