package ru.etu.mldemonstrationapp.mainservice.dto;

import ru.etu.mldemonstrationapp.mainservice.entity.User;

public record LoginResponse(User user, String accessToken) {
}
