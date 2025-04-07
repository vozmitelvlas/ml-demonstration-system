package ru.etu.mldemonstrationapp.mainservice.dto;

import jakarta.validation.constraints.NotNull;

public record UserAccessRightRequest(@NotNull(message = "isActive cannot be null") Boolean isActive) {

}