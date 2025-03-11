package ru.etu.mldemonstrationapp.mainservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.ModelUserLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelUserLimit;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.service.AdminUserService;

import java.util.List;
import java.util.Map;

@RestController
@SecurityRequirement(name = "jwt-bearer")
@RequestMapping("/api/admin/users")
public class AdminUserController {
    @Autowired
    private AdminUserService adminUserService;

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

    @Operation(description = "Get all user limits for model")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{userId}/limits")
    public ResponseEntity<List<ModelUserLimitResponse>> getAllUserLimits(@PathVariable Long userId) {
        return ResponseEntity.ok(adminUserService.getAllUserLimits(userId));
    }

    @Operation(description = "Create or update user limit")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/{userId}/models/{modelId}/limit")
    public ModelUserLimitResponse updateUserLimit(@PathVariable Long userId, @PathVariable Long modelId, @RequestBody ModelUserLimit limit) {
        ModelUserLimit modelUserLimit = adminUserService.updateUserLimit(userId, modelId, limit);

        return new ModelUserLimitResponse(
                modelUserLimit,
                modelUserLimit.getModel().getModelId(),
                modelUserLimit.getModel().getName(),
                "/api/models/%d".formatted(modelUserLimit.getModel().getModelId())
        );
    }
}


