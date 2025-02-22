package ru.etu.mldemonstrationapp.mainservice.admin.users;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import ru.etu.mldemonstrationapp.mainservice.admin.users.dto.CreateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.users.dto.UpdateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.users.ModelUserLimit;
import ru.etu.mldemonstrationapp.mainservice.users.User;
import ru.etu.mldemonstrationapp.mainservice.users.dto.ModelUserLimitRequest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
    private final AdminUserService adminUserService;

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping
    public List<User> getUsers() {
        return adminUserService.getUsers();
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return adminUserService.getUser(id);
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "201")
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest dto, UriComponentsBuilder uriComponentsBuilder) {
        User user = adminUserService.createUser(dto);
        return ResponseEntity
                .created(uriComponentsBuilder
                        .replacePath("/api/admin/users/{userId}")
                        .build(Map.of("userId", user.getUserId()))
                )
                .body(user);
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest dto) {
        return adminUserService.updateUser(id, dto);
    }

    @ApiResponse(responseCode = "204")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{userId}/limits/{modelId}")
    public Optional<ModelUserLimit> getUserLimits(@PathVariable Long userId, @PathVariable Long modelId) {
        return adminUserService.getUserLimits(userId, modelId);
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "201")
    @PostMapping("/limits")
    public ResponseEntity<ModelUserLimit> createUserLimit(@Valid @RequestBody ModelUserLimitRequest request, UriComponentsBuilder uriComponentsBuilder) {
        ModelUserLimit modelUserLimit = adminUserService.createUserLimit(request);
        return ResponseEntity
                .created(uriComponentsBuilder
                        .replacePath("/api/admin/users/{userId}/limits/{modelId}")
                        .build(Map.of("userId", request.userId(), "modelId", request.modelId()))
                )
                .body(modelUserLimit);
    }

    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/limits/{id}")
    public ModelUserLimit updateUserLimit(@PathVariable Long id, @Valid @RequestBody ModelUserLimitRequest request) {
        return adminUserService.updateUserLimit(id, request);
    }
}


