package ru.etu.mldemonstrationapp.mainservice.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.LoginRequest;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.LoginResponse;
import ru.etu.mldemonstrationapp.mainservice.users.dto.CreateUserRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/login")
    ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping("/register")
    ResponseEntity<LoginResponse> register(@Valid @RequestBody CreateUserRequest createUserRequest) {
        return authService.register(createUserRequest);
    }

    @GetMapping("/logout")
    ResponseEntity<Void> logout(HttpServletRequest request) {
        ResponseCookie authCookie = jwtService.getEmptyTokenCookie();
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, authCookie.toString()).build();
    }
}
