package ru.etu.mldemonstrationapp.mainservice.auth;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.LoginRequest;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.LoginResponse;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.ResetPasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.users.dto.CreateUserRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PostMapping("/login")
    ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PostMapping("/register")
    ResponseEntity<LoginResponse> register(@Valid @RequestBody CreateUserRequest createUserRequest) {
        return authService.register(createUserRequest);
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @GetMapping("/logout")
    ResponseEntity<Void> logout(HttpServletRequest request) {
        ResponseCookie authCookie = jwtService.getEmptyTokenCookie();
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, authCookie.toString()).build();
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @PostMapping("/password-reset")
    ResponseEntity<Void> getPasswordResetToken(@RequestBody ResetPasswordRequest passwordResetRequest,
                                               HttpServletRequest request) {

        String origin = request.getHeader("Origin");
        if (!StringUtils.hasLength(origin)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Origin header does not presented in the request");
        }
        authService.sendResetPasswordToken(passwordResetRequest, origin);
        return ResponseEntity.noContent().build();
    }


}
