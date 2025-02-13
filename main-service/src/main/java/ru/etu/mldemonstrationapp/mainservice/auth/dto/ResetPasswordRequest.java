package ru.etu.mldemonstrationapp.mainservice.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(@NotBlank(message = "Email cannot be blank")
                                   @Email(message = "Invalid email format")
                                   String email) {
}
