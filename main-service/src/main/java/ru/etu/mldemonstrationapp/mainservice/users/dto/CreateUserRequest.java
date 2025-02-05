package ru.etu.mldemonstrationapp.mainservice.users.dto;

public record CreateUserRequest(
        String login,
        String password,
        String email,
        String firstName,
        String lastName,
        String patronymic,
        String description
) {}
