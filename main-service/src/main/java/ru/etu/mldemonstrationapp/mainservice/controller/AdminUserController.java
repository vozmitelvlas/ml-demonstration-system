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

    /**
     * Create a new user.
     * 
     * @param dto The request body containing the user details.
     * @return The created user.
     */
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

    /**
     * Update an existing user.
     * 
     * @param id The ID of the user to update.
     * @param dto The request body containing the updated user details.
     * @return The updated user.
     */
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest dto) {
        return adminUserService.updateUser(id, dto);
    }

    /**
     * Delete a user.
     * 
     * @param id The ID of the user to delete.
     * @return No content if successful.
     */
    @ApiResponse(responseCode = "204")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all user limits for the all available models.
     * 
     * @param userId The ID of the user.
     * @return A list of user limits for all available models.
     */
    @Operation(description = "Get all user limits for model")
    @ApiResponse(useReturnTypeSchema = true, responseCode = "200")
    @GetMapping("/{userId}/limits")
    public ResponseEntity<List<ModelUserLimitResponse>> getAllUserLimits(@PathVariable Long userId) {
        return ResponseEntity.ok(adminUserService.getAllUserLimits(userId));
    }

    /**
     * Create or update a user limit.
     * 
     * @param userId The ID of the user.
     * @param modelId The ID of the model.
     * @param limit The limit to create or update.
     * @return The created or updated user limit.
     */
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


