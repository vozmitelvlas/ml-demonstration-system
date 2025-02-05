package ru.etu.mldemonstrationapp.mainservice.users.dto;

import java.util.List;

public record UpdateUserRequest(
        String firstName,
        String lastName,
        String patronymic,
        String description,
        List<String> roles
) {}