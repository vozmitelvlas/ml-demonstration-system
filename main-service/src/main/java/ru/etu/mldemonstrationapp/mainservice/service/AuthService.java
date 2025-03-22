package ru.etu.mldemonstrationapp.mainservice.service;

import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.http.ResponseEntity;
import ru.etu.mldemonstrationapp.mainservice.dto.LoginRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.LoginResponse;
import ru.etu.mldemonstrationapp.mainservice.dto.ResetPasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UserRegistrationRequest;

public interface AuthService {
    ResponseEntity<LoginResponse> login(LoginRequest loginRequest);

    ResponseEntity<LoginResponse> register(UserRegistrationRequest createUserRequest, String origin);

    void sendResetPasswordToken(ResetPasswordRequest request, String origin);

    void sendEmailConfirmToken(ResetPasswordRequest passwordResetRequest, String origin);
}
