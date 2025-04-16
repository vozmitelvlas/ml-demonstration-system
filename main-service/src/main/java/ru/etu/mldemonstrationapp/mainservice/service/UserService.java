package ru.etu.mldemonstrationapp.mainservice.service;

import jakarta.transaction.Transactional;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdatePasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateProfileRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UserRegistrationRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.*;

import java.util.List;

public interface UserService {
    User getUserById(Long id);

    User getUserByEmail(String email);

    @Transactional
    User registerUser(UserRegistrationRequest request);

    @Transactional
    User updateUser(Long id, UpdateProfileRequest request);

    @Transactional
    void updateUserPassword(Long id, UpdatePasswordRequest request);

    @Transactional
    void setUserPassword(Long id, String password);

    @Transactional
    void deleteUser(Long id);

    @Transactional
    void setUserEmailConfirm(Long id);

    @Transactional
    List<ModelUserLimit> createAndSaveUserLimits(Organization organization, ModelOrganizationLimit limit);

    @Transactional
    List<ModelUserLimit> createAndSaveUserLimits(User user, List<Model> models);
}
