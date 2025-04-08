package ru.etu.mldemonstrationapp.mainservice.service;

import org.springframework.http.ResponseEntity;
import ru.etu.mldemonstrationapp.mainservice.dto.*;

public interface AuthService {
    ResponseEntity<LoginResponse> login(LoginRequest loginRequest);

    RegisterResponse register(UserRegistrationRequest createUserRequest, String origin);

    void sendResetPasswordToken(ResetPasswordRequest request, String origin);
}
