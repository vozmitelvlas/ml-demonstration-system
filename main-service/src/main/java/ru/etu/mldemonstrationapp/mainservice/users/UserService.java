package ru.etu.mldemonstrationapp.mainservice.users;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.users.dto.CreateUserRequest;
import ru.etu.mldemonstrationapp.mainservice.users.dto.UpdateUserRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByLogin(request.login()) || userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Login or email already exists");
        }

        User user = new User();
        user.setLogin(request.login());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPatronymic(request.patronymic());
        user.setDescription(request.description());
        user.setOrganization(request.organization());
        user.setRoles(userRepository.findRolesByName(request.roles()));

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, UpdateUserRequest request) {
        User user = getUserById(id);
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPatronymic(request.patronymic());
        user.setDescription(request.description());
        user.setRoles(userRepository.findRolesByName(request.roles()));

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}