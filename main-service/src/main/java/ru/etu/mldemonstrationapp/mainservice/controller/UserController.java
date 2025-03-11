package ru.etu.mldemonstrationapp.mainservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.etu.mldemonstrationapp.mainservice.configuration.JwtToken;
import ru.etu.mldemonstrationapp.mainservice.dto.NewPasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdatePasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateProfileRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.service.JwtService;
import ru.etu.mldemonstrationapp.mainservice.service.UserService;

/**
 * Controller for handling user-related requests.
 * 
 */
@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "jwt-bearer")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    /**
     * Get the current user's profile.
     *
     * @param token The JWT token containing the user ID
     * @return The current user's profile
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal JwtToken token) {
        return ResponseEntity.ok(userService.getUserById(token.userId()));
    }

    /**
     * Update the current user's profile.
     *
     * @param token The JWT token containing the user ID
     * @param request The update request containing new user details
     * @return The updated user profile
     */
    @Operation(description = "Update your own user profile")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal JwtToken token, @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateUser(token.userId(), request));
    }

    /**
     * Delete the current user's profile.
     *
     * @param token The JWT token containing the user ID
     * @return No content if successful
     */
    @Operation(description = "Set a new password using a password reset token")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @PostMapping("/profile/password/reset")
    public ResponseEntity<Void> setNewPassword(@AuthenticationPrincipal JwtToken jwtToken, @Valid @RequestBody NewPasswordRequest newPasswordRequest) {
        userService.setUserPassword(jwtToken.userId(), newPasswordRequest.password());
        return ResponseEntity.noContent().build();
    }

    /**
     * Update the current user's password.
     * 
     * @param jwtToken The JWT token containing the user ID
     * @param updatePasswordRequest The request containing the old and new passwords
     * @return No content if successful
     */
    @Operation(description = "Update password with confirmation of the old one")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @PutMapping("/profile/password")
    public ResponseEntity<Void> updatePassword(@AuthenticationPrincipal JwtToken jwtToken, @Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        userService.updateUserPassword(jwtToken.userId(), updatePasswordRequest);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete the current user's profile.
     * 
     * @param jwtToken The JWT token containing the user ID
     * @return No content if successful
     */
    @Operation(description = "Delete your own user")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal JwtToken jwtToken) {
        userService.deleteUser(jwtToken.userId());
        ResponseCookie authCookie = jwtService.getEmptyTokenCookie();
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, authCookie.toString()).build();
    }
}
