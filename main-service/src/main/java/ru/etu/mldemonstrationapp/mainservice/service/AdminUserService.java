package ru.etu.mldemonstrationapp.mainservice.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.ModelUserLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelUserLimit;
import ru.etu.mldemonstrationapp.mainservice.entity.User;

import java.util.List;

public interface AdminUserService {
    List<User> getUsers();

    User getUser(Long userId);

    List<ModelUserLimitResponse> getAllUserLimits(Long userId);

    @Transactional
    User createUser(CreateUserRequest dto);

    @Transactional
    User updateUser(Long userId, @Valid UpdateUserRequest dto);

    @Transactional
    void deleteUser(Long id);

    @Transactional
    ModelUserLimit updateUserLimit(Long userId, Long modelId, ModelUserLimit limit);

    @Transactional
    void activateUser(Long userId);

    @Transactional
    void deactivateUser(Long userId);
}
