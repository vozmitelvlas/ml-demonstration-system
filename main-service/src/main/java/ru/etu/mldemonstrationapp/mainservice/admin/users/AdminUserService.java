package ru.etu.mldemonstrationapp.mainservice.admin.users;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.admin.users.dto.CreateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.users.dto.ModelUserLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.admin.users.dto.UpdateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.models.LimitRepository;
import ru.etu.mldemonstrationapp.mainservice.models.Model;
import ru.etu.mldemonstrationapp.mainservice.models.ModelRepository;
import ru.etu.mldemonstrationapp.mainservice.organizations.ModelOrganizationLimit;
import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;
import ru.etu.mldemonstrationapp.mainservice.organizations.OrganizationRepository;
import ru.etu.mldemonstrationapp.mainservice.users.ModelUserLimit;
import ru.etu.mldemonstrationapp.mainservice.users.Role;
import ru.etu.mldemonstrationapp.mainservice.users.User;
import ru.etu.mldemonstrationapp.mainservice.users.UserRepository;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

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

    public List<ModelUserLimitResponse> getAllUserLimits(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id %s not found".formatted(userId)));

        // Get organization limits for those models that do not have user limits
        List<ModelOrganizationLimit> modelOrganizationLimits = limitRepository.findAllByOrganizationWhereModelNotInList(
                user.getOrganization(), user.getLimits().stream().map(ModelUserLimit::getModel).toList()
        );

        var organizationLimitsResponses = modelOrganizationLimits.stream().map(limit -> ModelUserLimitResponse.fromLimitAndModel(limit, limit.getModel()));
        var userLimits = user.getLimits().stream().map(limit -> ModelUserLimitResponse.fromLimitAndModel(limit, limit.getModel()));

        /*
            Return a list of limits that containing all ModelUserLimits for the user
            and ModelOrganizationLimits for all models available to the user's organization
         */
        return Stream.concat(organizationLimitsResponses, userLimits).toList();
    }

    @Transactional
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

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }


    @Transactional
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
}
