package ru.etu.mldemonstrationapp.mainservice.service;

import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseCookie;
import ru.etu.mldemonstrationapp.mainservice.configuration.CustomUserDetails;

public interface JwtService {
    String AUTH_TOKEN_COOKIE_NAME = "x-auth-token";

    String generateResetPasswordToken(CustomUserDetails userDetails);

    String generateAccessToken(CustomUserDetails userDetails);

    String generateEmailConfirmToken(CustomUserDetails userDetails);

    ResponseCookie generateAccessTokenCookie(String token);

    ResponseCookie getEmptyTokenCookie();

    Claims parseToken(String token);
}
