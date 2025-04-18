package ru.etu.mldemonstrationapp.mainservice.service.impl;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.ModelUserLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.*;
import ru.etu.mldemonstrationapp.mainservice.repository.*;
import ru.etu.mldemonstrationapp.mainservice.service.AdminUserService;
import ru.etu.mldemonstrationapp.mainservice.service.UserRpwService;
import ru.etu.mldemonstrationapp.mainservice.service.UserService;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private LimitRepository limitRepository;
    @Autowired
    private ModelRepository modelRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private UserRpwRepository userRpwRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRpwService userRpwService;

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUser(Long userId) {
        return userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id %s not found".formatted(userId))
        );
    }

    @Override
    public List<ModelUserLimitResponse> getAllUserLimits(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id %s not found".formatted(userId)));

        return user.getLimits().stream().map(limit -> ModelUserLimitResponse.fromLimitAndModel(
                limit, limit.getModel()
        )).toList();
    }

    @Transactional
    @Override
    public User createUser(CreateUserRequest dto) {
        if (userRepository.existsByLogin(dto.login())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login already in use");
        }

        if (userRepository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        Organization organization = organizationRepository.findById(dto.organizationId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Organization with id %s does not exist".formatted(dto.organizationId())
                ));

        return userRepository.save(new User(
                null,
                dto.login(),
                passwordEncoder.encode(dto.password()),
                dto.email(),
                dto.firstName(),
                dto.lastName(),
                dto.patronymic(),
                dto.description(),
                dto.active(),
                dto.emailConfirm(),
                Collections.emptyList(),
                organization,
                findRolesOrThrowConflict(dto.roles()), // Получение и проверка ролей
                Instant.now(),
                Instant.now()
        ));
    }

    @Transactional
    @Override
    public User updateUser(Long userId, @Valid UpdateUserRequest dto) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id %s not found".formatted(userId))
        );

        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPatronymic(dto.patronymic());
        user.setDescription(dto.description());

        if (!user.getOrganization().getOrganizationId().equals(dto.organizationId())) {
            // Проверка на существование организации при обновлении
            Organization organization = organizationRepository.findById(dto.organizationId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Organization with id %s does not exist".formatted(dto.organizationId())
                    ));

            userRpwRepository.deleteAllByUser(user);

            // Delete all user limits due to changing of available models list
            limitRepository.deleteAllByIdInBatch(user.getLimits().stream().map(Limit::getLimitId).toList());

            List<Model> models = modelRepository.findAllByOrganization(organization);

            user.setOrganization(organization);

            userService.createAndSaveUserLimitsForOrgModels(user);
            userRpwService.createAndSaveModelsRpwForUser(user, models);
        }

        // Обновление ролей
        user.setRoles(findRolesOrThrowConflict(dto.roles()));

        return userRepository.save(user);
    }

    @Transactional
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    @Override
    public ModelUserLimit updateUserLimit(Long userId, Long modelId, ModelUserLimit limit) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Model model = modelRepository.findById(modelId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));

        limitRepository.findByOrganizationIdAndModelId(user.getOrganization().getOrganizationId(), modelId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.FORBIDDEN, "User do not have access to this model"));

        limitRepository.findByUserIdAndModelId(userId, modelId).ifPresent(userLimit -> limit.setLimitId(userLimit.getLimitId()));

        limit.setUser(user);
        limit.setModel(model);
        return limitRepository.save(limit);
    }

    private List<Role> findRolesOrThrowConflict(List<String> rolesNames) {
        // Проверка ролей
        List<Role> roles = userRepository.findRolesByName(rolesNames);
        if (roles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Not found any valid roles for the user");
        }
        return roles;
    }

    @Transactional
    @Override
    public void setAccessRight(Long userId, Boolean isActive) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found")
        );
        user.setActive(isActive);
        userRepository.save(user);
    }

    @Override
    public Limit getLimitsByType(Long userId, Long modelId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id %s not found".formatted(userId)));

        OrganizationLimitsType limitsType = user.getOrganization().getLimitsType();
        if (limitsType == OrganizationLimitsType.USER_LIMITS) {
            return user.getLimits().stream()
                    .filter(lim -> lim.getModel().getModelId().equals(modelId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Limit for model ID " + modelId + " not found"));
        }

        return user.getOrganization().getModelsLimits().stream()
                .filter(lim -> lim.modelId().equals(modelId))
                .findFirst()
                .map(limit -> {
                    ModelOrganizationLimit orgLimit = (ModelOrganizationLimit) limit.limit();
                    if (limitsType == OrganizationLimitsType.ORGANIZATION_LIMITS) {
                        return orgLimit;
                    } else if (limitsType == OrganizationLimitsType.MODEL_LIMITS) {
                        return orgLimit.getModel().getLimit();
                    } else {
                        throw new IllegalArgumentException("Unknown limits type: " + limitsType);
                    }
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Limit for modelId " + modelId + " not found"));
    }
}
