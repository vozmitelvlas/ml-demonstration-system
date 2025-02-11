package ru.etu.mldemonstrationapp.mainservice.users;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.etu.mldemonstrationapp.mainservice.auth.JwtService;
import ru.etu.mldemonstrationapp.mainservice.auth.JwtToken;
import ru.etu.mldemonstrationapp.mainservice.users.dto.UpdatePasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.users.dto.UpdateUserRequest;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

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

    @Operation(description = "Update password with confirmation of the old one")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @PatchMapping("/profile/password-change")
    public ResponseEntity<Void> updatePassword(@AuthenticationPrincipal JwtToken token, @Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        userService.updateUserPassword(token.userId(), updatePasswordRequest);
        return ResponseEntity.noContent().build();
    }

    @Operation(description = "Delete your own user")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "204")
    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal JwtToken token) {
        userService.deleteUser(token.userId());
        ResponseCookie authCookie = jwtService.getEmptyTokenCookie();
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, authCookie.toString()).build();
    }
}
