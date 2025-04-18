package ru.etu.mldemonstrationapp.mainservice.controller;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.configuration.JwtToken;
import ru.etu.mldemonstrationapp.mainservice.dto.*;
import ru.etu.mldemonstrationapp.mainservice.service.AuthService;
import ru.etu.mldemonstrationapp.mainservice.service.JwtService;

/**
 * Controller for handling authentication-related requests.
 * 
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    /**
     * Login to the application.
     *
     * @param loginRequest Request with data required to log in.
     * @return {@link LoginResponse}.
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }


    /**
     * Register in the application.
     * @param createUserRequest Request with a new user details.
     * @param request HttpServletRequest to get Origin header to generate a link.
     * @return {@link RegisterResponse}
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PostMapping("/register")
    public RegisterResponse register(@Valid @RequestBody UserRegistrationRequest createUserRequest,
                                                  HttpServletRequest request) {
        String origin = request.getHeader("Origin");
        if (!StringUtils.hasLength(origin)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Origin header does not presented in the request");
        }

        return authService.register(createUserRequest, origin);
    }

    /**
     * Log out of the application.
     *
     * @return No content with removed authentication token cookie.
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @GetMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie authCookie = jwtService.getEmptyTokenCookie();
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, authCookie.toString()).build();
    }

    /**
     * Get a password reset token via email. Token can be used to set new password
     * in the {@link UserController#setNewPassword(JwtToken, NewPasswordRequest)}
     *
     * @param passwordResetRequest Request body with an email of the user.
     * @param request HttpServletRequest to get Origin header to generate a link.
     * @return No content if successful. Forbidden if user with specified email is not found.
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @PostMapping("/password-reset")
    public ResponseEntity<Void> getPasswordResetToken(@RequestBody ResetPasswordRequest passwordResetRequest,
                                               HttpServletRequest request) {

        String origin = request.getHeader("Origin");
        if (!StringUtils.hasLength(origin)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Origin header does not presented in the request");
        }
        authService.sendResetPasswordToken(passwordResetRequest, origin);
        return ResponseEntity.noContent().build();
    }
}
