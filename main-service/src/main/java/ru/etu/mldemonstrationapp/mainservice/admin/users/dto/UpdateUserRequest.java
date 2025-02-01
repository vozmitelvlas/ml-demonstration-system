package ru.etu.mldemonstrationapp.mainservice.admin.users.dto;

import java.util.List;

public record UpdateUserRequest(
        String firstName,
        String lastName,
        String description,
        String patronymic,
        Long organizationId,
        List<String> roles
) {
}
