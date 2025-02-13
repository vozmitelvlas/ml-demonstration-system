package ru.etu.mldemonstrationapp.mainservice.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NewPasswordRequest(@NotBlank(message = "Password cannot be blank")
                                 @Size(min = 6, max = 255, message = "Password length must be between 6 and 255 characters")
                                 String password) {
}
