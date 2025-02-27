package ru.etu.mldemonstrationapp.mainservice.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "oldPassword cannot be blank")
        @Size(min = 6, max = 255, message = "Password length must be between 6 and 255 characters")
        String oldPassword,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6, max = 255, message = "Password length must be between 6 and 255 characters")
        String newPassword
) {
}
