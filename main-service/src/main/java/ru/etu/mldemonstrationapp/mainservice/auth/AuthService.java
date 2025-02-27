package ru.etu.mldemonstrationapp.mainservice.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.LoginRequest;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.LoginResponse;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.ResetPasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.config.CustomUserDetails;
import ru.etu.mldemonstrationapp.mainservice.email.EmailService;
import ru.etu.mldemonstrationapp.mainservice.users.User;
import ru.etu.mldemonstrationapp.mainservice.users.UserService;
import ru.etu.mldemonstrationapp.mainservice.users.dto.UserRegistrationRequest;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.login(),
                loginRequest.password())
        );
        var userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtService.generateAccessToken(userDetails);
        ResponseCookie cookie = jwtService.generateAccessTokenCookie(token);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(new LoginResponse(userDetails.user(), token));
    }

    public ResponseEntity<LoginResponse> register(UserRegistrationRequest createUserRequest) {
        User user = userService.registerUser(createUserRequest);
        String token = jwtService.generateAccessToken(new CustomUserDetails(user));
        ResponseCookie cookie = jwtService.generateAccessTokenCookie(token);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(new LoginResponse(user, token));
    }

    public void sendResetPasswordToken(ResetPasswordRequest request, String origin) {
        User user = userService.getUserByEmail(request.email());
        String token = jwtService.generateResetPasswordToken(new CustomUserDetails(user));
        emailService.sendMessage(user.getEmail(), "Восстановление пароля", "%s/password-reset?token=%s".formatted(origin, token));
    }


}
