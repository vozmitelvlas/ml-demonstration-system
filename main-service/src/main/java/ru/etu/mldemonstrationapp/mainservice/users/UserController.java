package ru.etu.mldemonstrationapp.mainservice.users;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.etu.mldemonstrationapp.mainservice.auth.JwtToken;
import ru.etu.mldemonstrationapp.mainservice.users.dto.NewPasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.users.dto.UpdatePasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.users.dto.UpdateUserRequest;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "jwt-bearer")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal JwtToken token) {
        return ResponseEntity.ok(userService.getUserById(token.userId()));
    }

    @Operation(description = "Update your own user profile")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal JwtToken token, @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(token.userId(), request));
    }

    @Operation(description = "Set a new password using a password reset token")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @PostMapping("/profile/password/reset")
    public ResponseEntity<Void> setNewPassword(@AuthenticationPrincipal JwtToken jwtToken, @Valid @RequestBody NewPasswordRequest newPasswordRequest) {
        userService.setUserPassword(jwtToken.userId(), newPasswordRequest.password());
        return ResponseEntity.noContent().build();
    }

    @Operation(description = "Update password with confirmation of the old one")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @PutMapping("/profile/password")
    public ResponseEntity<Void> updatePassword(@AuthenticationPrincipal JwtToken jwtToken, @Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        userService.updateUserPassword(jwtToken.userId(), updatePasswordRequest);
        return ResponseEntity.noContent().build();
    }

    @Operation(description = "Delete your own user")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal JwtToken jwtToken) {
        ResponseCookie authCookie = userService.deleteUser(jwtToken.userId());
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, authCookie.toString()).build();
    }
}
