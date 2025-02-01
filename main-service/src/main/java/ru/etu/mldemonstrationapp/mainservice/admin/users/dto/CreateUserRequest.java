package ru.etu.mldemonstrationapp.mainservice.admin.users.dto;

import java.util.List;

public record CreateUserRequest(
        String login,
        String password,
        String email,
        String firstName,
        String lastName,
        String patronymic,
        String description,
        Long organizationId,
        List<String> roles
) {

}
