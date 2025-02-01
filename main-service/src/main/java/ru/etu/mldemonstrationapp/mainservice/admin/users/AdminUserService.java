package ru.etu.mldemonstrationapp.mainservice.admin.users;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.admin.users.dto.CreateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.users.dto.UpdateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;
import ru.etu.mldemonstrationapp.mainservice.organizations.OrganizationRepository;
import ru.etu.mldemonstrationapp.mainservice.users.Role;
import ru.etu.mldemonstrationapp.mainservice.users.User;
import ru.etu.mldemonstrationapp.mainservice.users.UserRepository;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    @Transactional
    public User createUser(CreateUserRequest dto) {
        if (userRepository.existsByLogin(dto.login())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login already in use");
        }

        if (userRepository.existsByEmail(dto.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        Organization organization = organizationRepository.findById(dto.organizationId()).orElseThrow(() -> new ResponseStatusException(
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
                organization,
                findRolesOrThrowConflict(dto.roles()),
                Instant.now(),
                Instant.now()
        ));

    }

    @Transactional
    public User updateUser(Long userId, UpdateUserRequest dto) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setPatronymic(dto.patronymic());
        user.setDescription(dto.description());
        if (dto.organizationId() != null) {
            Organization organization = organizationRepository.findById(dto.organizationId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Organization with id %s does not exist".formatted(dto.organizationId()))
                    );
            user.setOrganization(organization);
        }
        user.setRoles(findRolesOrThrowConflict(dto.roles()));

        return userRepository.save(user);
    }

    private List<Role> findRolesOrThrowConflict(List<String> rolesNames) {
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
}
