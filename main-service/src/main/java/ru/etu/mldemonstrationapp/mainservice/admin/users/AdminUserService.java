package ru.etu.mldemonstrationapp.mainservice.admin.users;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.admin.users.dto.CreateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.users.dto.UpdateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.models.Limit;
import ru.etu.mldemonstrationapp.mainservice.models.Model;
import ru.etu.mldemonstrationapp.mainservice.models.LimitRepository;
import ru.etu.mldemonstrationapp.mainservice.models.ModelRepository;
import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;
import ru.etu.mldemonstrationapp.mainservice.organizations.OrganizationRepository;
import ru.etu.mldemonstrationapp.mainservice.users.ModelUserLimit;
import ru.etu.mldemonstrationapp.mainservice.users.Role;
import ru.etu.mldemonstrationapp.mainservice.users.User;
import ru.etu.mldemonstrationapp.mainservice.users.UserRepository;
import ru.etu.mldemonstrationapp.mainservice.users.dto.ModelUserLimitRequest;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final LimitRepository limitRepository;
    private final ModelRepository modelRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id %s not found".formatted(userId))
        );
    }

    public Optional<ModelUserLimit> getUserLimits(Long userId, Long modelId) {
        return limitRepository.findByUserIdAndModelId(userId, modelId);
    }

    @Transactional
    public User createUser(@Valid CreateUserRequest dto) {
        // Проверка на существование логина
        if (userRepository.existsByLogin(dto.login())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login already in use");
        }

        // Проверка на существование email
        if (userRepository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        // Проверка на существование организации
        Organization organization = organizationRepository.findById(dto.organizationId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Organization with id %s does not exist".formatted(dto.organizationId())
                ));

        // Сохранение нового пользователя
        return userRepository.save(new User(
                null,
                dto.login(),
                dto.password(),
                dto.email(),
                dto.firstName(),
                dto.lastName(),
                dto.patronymic(),
                dto.description(),
                Collections.emptyList(),
                organization,
                findRolesOrThrowConflict(dto.roles()), // Получение и проверка ролей
                Instant.now(),
                Instant.now()
        ));
    }

    @Transactional
    public User updateUser(Long userId, @Valid UpdateUserRequest dto) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id %s not found".formatted(userId))
        );

        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPatronymic(dto.patronymic());
        user.setDescription(dto.description());

        if (dto.organizationId() != null) {
            // Проверка на существование организации при обновлении
            Organization organization = organizationRepository.findById(dto.organizationId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Organization with id %s does not exist".formatted(dto.organizationId())
                    ));
            user.setOrganization(organization);
        }

        // Обновление ролей
        user.setRoles(findRolesOrThrowConflict(dto.roles()));

        return userRepository.save(user);
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
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public ModelUserLimit createUserLimit(ModelUserLimitRequest request) {
        Model model = modelRepository.findById(request.modelId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));
        Limit limit = limitRepository.findById(request.limitId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Limit not found"));
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        ModelUserLimit modelUserLimit = new ModelUserLimit(model, user, limit);
        return limitRepository.save(modelUserLimit);
    }

    @Transactional
    public ModelUserLimit updateUserLimit(Long id, ModelUserLimitRequest request) {
        ModelUserLimit modelUserLimit = limitRepository.findByUserIdAndModelId(request.userId(), request.modelId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Limit not found"));

        Model model = modelRepository.findById(request.modelId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Model not found"));
        Limit limit = limitRepository.findById(request.limitId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Limit not found"));
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        modelUserLimit.setModel(model);
        modelUserLimit.setUser(user);
        modelUserLimit.setLimit(limit);

        return limitRepository.save(modelUserLimit);
    }
}
