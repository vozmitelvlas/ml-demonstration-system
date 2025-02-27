package ru.etu.mldemonstrationapp.mainservice.users;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.auth.JwtService;
import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;
import ru.etu.mldemonstrationapp.mainservice.organizations.OrganizationRepository;
import ru.etu.mldemonstrationapp.mainservice.users.dto.CreateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.users.dto.UpdatePasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.users.dto.UpdateUserRequest;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrganizationRepository organizationRepository;
    private final JwtService jwtService;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    @Transactional
    public User registerUser(CreateUserRequest request) {
        if (userRepository.existsByLogin(request.login())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        List<Role> userRoles = userRepository.findRolesByName(Collections.singletonList("USER"));
        if (userRoles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Default role USER not found");
        }

        // Default organization
        Organization organization = organizationRepository.findById(4L)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "Organization with id 4 does not exist"));

        User user = new User();
        user.setLogin(request.login());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPatronymic(request.patronymic());
        user.setDescription(request.description());
        user.setRoles(userRoles);
        user.setOrganization(organization);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, UpdateUserRequest request) {
        User user = getUserById(id);
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPatronymic(request.patronymic());
        user.setDescription(request.description());
        return userRepository.save(user);
    }

    @Transactional
    public void updateUserPassword(Long id, UpdatePasswordRequest request) {
        User user = userRepository.findById(id).orElseThrow();
        if (passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.newPassword()));
            userRepository.save(user);
            return;
        }
        throw new BadCredentialsException("Old password is incorrect");
    }

    @Transactional
    public void setUserPassword(Long id, String password) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found")
        );
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }


    @Transactional
    public ResponseCookie deleteUser(Long id) {
        userRepository.deleteById(id);
        return jwtService.getEmptyTokenCookie();
    }

}
