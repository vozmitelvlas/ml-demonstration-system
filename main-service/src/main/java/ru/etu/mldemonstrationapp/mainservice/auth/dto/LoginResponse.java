package ru.etu.mldemonstrationapp.mainservice.auth.dto;

import ru.etu.mldemonstrationapp.mainservice.users.User;

public record LoginResponse(User user) {
}
