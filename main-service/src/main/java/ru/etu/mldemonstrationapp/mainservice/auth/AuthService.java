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
import ru.etu.mldemonstrationapp.mainservice.config.CustomUserDetails;
import ru.etu.mldemonstrationapp.mainservice.users.User;
import ru.etu.mldemonstrationapp.mainservice.users.UserService;
import ru.etu.mldemonstrationapp.mainservice.users.dto.CreateUserRequest;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.login(),
                loginRequest.password())
        );
        var userDetails = (CustomUserDetails) authentication.getPrincipal();
        ResponseCookie cookie = jwtService.generateTokenCookie(userDetails);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(new LoginResponse(userDetails.user()));
    }

    public ResponseEntity<LoginResponse> register(CreateUserRequest createUserRequest) {
        User user = userService.createUser(createUserRequest);
        ResponseCookie cookie = jwtService.generateTokenCookie(new CustomUserDetails(user));
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(new LoginResponse(user));
    }
}
