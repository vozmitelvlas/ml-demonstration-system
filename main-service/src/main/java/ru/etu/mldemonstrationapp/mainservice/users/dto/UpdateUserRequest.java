package ru.etu.mldemonstrationapp.mainservice.users.dto;

public record UpdateUserRequest(
        String firstName,
        String lastName,
        String patronymic,
        String description
) {}