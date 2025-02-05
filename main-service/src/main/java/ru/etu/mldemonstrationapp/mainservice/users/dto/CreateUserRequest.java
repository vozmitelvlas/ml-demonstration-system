package ru.etu.mldemonstrationapp.mainservice.users.dto;

import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;

import java.util.List;

public record CreateUserRequest(
        String login,
        String password,
        String email,
        String firstName,
        String lastName,
        String patronymic,
        String description,
        Organization organization,
        List<String> roles
) {}
