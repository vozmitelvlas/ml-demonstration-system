package ru.etu.mldemonstrationapp.mainservice.admin.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record UpdateUserRequest(
        @NotBlank(message = "First name cannot be blank")
        @Size(max = 50, message = "First name should not exceed 50 characters")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        @Size(max = 50, message = "Last name should not exceed 50 characters")
        String lastName,

        @Size(max = 200, message = "Description should not exceed 200 characters")
        String description,

        @Size(max = 50, message = "Patronymic should not exceed 50 characters")
        String patronymic,

        Long organizationId,

        List<String> roles
) {}
