package ru.etu.mldemonstrationapp.mainservice.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.configuration.CustomUserDetails;
import ru.etu.mldemonstrationapp.mainservice.dto.*;
import ru.etu.mldemonstrationapp.mainservice.entity.Model;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.repository.ModelRepository;
import ru.etu.mldemonstrationapp.mainservice.service.AuthService;
import ru.etu.mldemonstrationapp.mainservice.service.EmailService;
import ru.etu.mldemonstrationapp.mainservice.service.JwtService;
import ru.etu.mldemonstrationapp.mainservice.service.UserService;

import java.util.List;

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
    private ModelRepository modelRepository;
    @Autowired
    private UserRpwServiceImpl userRpwService;

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
    public RegisterResponse register(UserRegistrationRequest createUserRequest, String origin) {
        User user = userService.registerUser(createUserRequest);

        //set users limits and rps
        List<Model> models = modelRepository.findAllByOrganization(user.getOrganization());
        userService.createAndSaveUserLimits(user, models);
        userRpwService.createAndSaveModelsRpwForUser(user, models);

        // send confirm message
        String token = jwtService.generateEmailConfirmToken(new CustomUserDetails(user));
        emailService.sendMessage(user.getEmail(), "Подтверждение адреса электронной почты", "%s/models?token=%s".formatted(origin, token));

        return new RegisterResponse(user);
    }

    @Override
    public void sendResetPasswordToken(ResetPasswordRequest request, String origin) {
        User user = userService.getUserByEmail(request.email());
        String token = jwtService.generateResetPasswordToken(new CustomUserDetails(user));
        emailService.sendMessage(user.getEmail(), "Восстановление пароля", "%s/password-reset?token=%s".formatted(origin, token));
    }
}
