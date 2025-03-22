package ru.etu.mldemonstrationapp.mainservice.service.impl;

import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.configuration.CustomUserDetails;
import ru.etu.mldemonstrationapp.mainservice.dto.LoginRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.LoginResponse;
import ru.etu.mldemonstrationapp.mainservice.dto.ResetPasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UserRegistrationRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.repository.UserRepository;
import ru.etu.mldemonstrationapp.mainservice.service.AuthService;
import ru.etu.mldemonstrationapp.mainservice.service.EmailService;
import ru.etu.mldemonstrationapp.mainservice.service.JwtService;
import ru.etu.mldemonstrationapp.mainservice.service.UserService;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.login(),
                loginRequest.password())
        );
        var userDetails = (CustomUserDetails) authentication.getPrincipal();

        if (!userDetails.user().getEmailConfirm()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Подтвердите почту, перейдя по ссылке в письме");
        }

        String token = jwtService.generateAccessToken(userDetails);
        ResponseCookie cookie = jwtService.generateAccessTokenCookie(token);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(new LoginResponse(userDetails.user(), token));
    }

    @Override
    public ResponseEntity<LoginResponse> register(UserRegistrationRequest createUserRequest, String origin) {
        User user = userService.registerUser(createUserRequest);
        String token = jwtService.generateRegisterToken(new CustomUserDetails(user));
        ResponseCookie cookie = jwtService.generateAccessTokenCookie(token);

        emailService.sendMessage(user.getEmail(), "Подтвеждение адреса электронной почты", "%s/models?token=%s".formatted(origin, token));
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(new LoginResponse(user, token));
    }

    @Override
    public void sendResetPasswordToken(ResetPasswordRequest request, String origin) {
        User user = userService.getUserByEmail(request.email());
        String token = jwtService.generateResetPasswordToken(new CustomUserDetails(user));
        emailService.sendMessage(user.getEmail(), "Восстановление пароля", "%s/password-reset?token=%s".formatted(origin, token));
    }
    @Override
    public void sendEmailConfirmToken(ResetPasswordRequest request, String origin) {
        User user = userService.getUserByEmail(request.email());
        String token = jwtService.generateRegisterToken(new CustomUserDetails(user));
        emailService.sendMessage(user.getEmail(), "Подтверждение адреса электронной почты", "%s/models?token=%s".formatted(origin, token));
    }
}
