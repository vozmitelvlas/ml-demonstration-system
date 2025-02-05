package ru.etu.mldemonstrationapp.mainservice.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.LoginRequest;
import ru.etu.mldemonstrationapp.mainservice.auth.dto.LoginResponse;
import ru.etu.mldemonstrationapp.mainservice.users.User;
import ru.etu.mldemonstrationapp.mainservice.users.UserService;
import ru.etu.mldemonstrationapp.mainservice.users.dto.CreateUserRequest;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(
                        loginRequest.login(),
                        loginRequest.password())
                );

        var userDetails = (CustomUserDetails) authentication.getPrincipal();
        return new LoginResponse(jwtService.generateToken(userDetails), userDetails.getUser());
    }

    public LoginResponse register(CreateUserRequest createUserRequest) {
        User user = userService.createUser(createUserRequest);
        return new LoginResponse(jwtService.generateToken(new CustomUserDetails(user)), user);
    }
}
