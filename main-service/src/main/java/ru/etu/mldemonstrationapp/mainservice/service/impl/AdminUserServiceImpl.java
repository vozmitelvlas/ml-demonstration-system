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
import ru.etu.mldemonstrationapp.mainservice.entity.Limit;
import ru.etu.mldemonstrationapp.mainservice.repository.LimitRepository;
import ru.etu.mldemonstrationapp.mainservice.entity.Model;
import ru.etu.mldemonstrationapp.mainservice.repository.ModelRepository;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelOrganizationLimit;
import ru.etu.mldemonstrationapp.mainservice.entity.Organization;
import ru.etu.mldemonstrationapp.mainservice.repository.OrganizationRepository;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelUserLimit;
import ru.etu.mldemonstrationapp.mainservice.entity.Role;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.repository.UserRepository;
import ru.etu.mldemonstrationapp.mainservice.service.AdminUserService;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

        var limits = limitRepository.findLimitsForUser(user);
        return limits.stream().map(result -> {
            var organizationLimit = (ModelOrganizationLimit) result[0];
            var userLimit = (ModelUserLimit) result[1];
            return ModelUserLimitResponse.fromLimitAndModel(
                    userLimit == null ? organizationLimit : userLimit,
                    organizationLimit.getModel()
            );

        }).toList();
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
            user.setOrganization(organization);

            // Delete all user limits due to changing of available models list
            limitRepository.deleteAllByIdInBatch(user.getLimits().stream().map(Limit::getLimitId).toList());
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
    public void setAccessRight(Long userId, Boolean isActive){
        User user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found")
        );
        user.setActive(isActive);
        userRepository.save(user);
    }



    @Override
    public Map<String, Integer> getLimitsByType(Long userId, Long modelId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id %s not found".formatted(userId)));

        String limitsType = String.valueOf(user.getOrganization().getLimitsType());

        return switch (limitsType) {
            case "MODEL_LIMITS" -> getModelLimits(modelId);
            case "USER_LIMITS" -> getUserLimits(userId, modelId);
            case "ORGANIZATION_LIMITS" -> getOrganizationLimits(userId, modelId);
            default -> throw new IllegalArgumentException("Unknown limits type: " + limitsType);
        };
    }

    @Override
    public Map<String, Integer> getUserLimits(Long userId, Long modelId) {
        Optional<ModelUserLimit> optionalLimit = limitRepository.findByUserIdAndModelId(userId, modelId);

        if (optionalLimit.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No limits found for userId: " + userId + " and modelId: " + modelId);
        }

        ModelUserLimit limit = optionalLimit.get();
        return Map.of(
                "rps", limit.getRps(),
                "requestsPerWeek", limit.getRequestsPerWeek()
        );
    }

    @Override
    public Map<String, Integer> getModelLimits(Long modelId) {
        Optional<Model> modelOptional = modelRepository.findById(modelId);

        if (modelOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Model with ID " + modelId + " not found.");
        }

        Model model = modelOptional.get();
        Limit limit = model.getLimit();

        if (limit == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No limits found for model with ID " + modelId);
        }

        return Map.of(
                "rps", limit.getRps(),
                "requestsPerWeek", limit.getRequestsPerWeek()
        );
    }

    @Override
    public Map<String, Integer> getOrganizationLimits(Long userId, Long modelId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id %s not found".formatted(userId)));

        Long organizationId = user.getOrganization().getOrganizationId();

        Optional<ModelOrganizationLimit> optionalLimit = limitRepository.findByOrganizationIdAndModelId(organizationId, modelId);

        if (optionalLimit.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No limits found for organizationId: " + organizationId + " and modelId: " + modelId);
        }

        ModelOrganizationLimit limit = optionalLimit.get();
        return Map.of(
                "rps", limit.getRps(),
                "requestsPerWeek", limit.getRequestsPerWeek()
        );
    }
}
