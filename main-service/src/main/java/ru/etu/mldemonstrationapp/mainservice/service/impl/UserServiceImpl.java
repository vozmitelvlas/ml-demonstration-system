package ru.etu.mldemonstrationapp.mainservice.service.impl;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdatePasswordRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UpdateProfileRequest;
import ru.etu.mldemonstrationapp.mainservice.dto.UserRegistrationRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.Organization;
import ru.etu.mldemonstrationapp.mainservice.entity.Role;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.repository.OrganizationRepository;
import ru.etu.mldemonstrationapp.mainservice.repository.UserRepository;
import ru.etu.mldemonstrationapp.mainservice.service.JwtService;
import ru.etu.mldemonstrationapp.mainservice.service.UserService;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private OrganizationRepository organizationRepository;

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

    @Transactional
    @Override
    public User registerUser(UserRegistrationRequest request) {
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
        Organization organization = organizationRepository.findById(1L)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "Default organization with id 1 does not exist"));

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

        user.setEmailConfirm(false);

        return userRepository.save(user);
    }

    @Transactional
    @Override
    public User updateUser(Long id, UpdateProfileRequest request) {
        User user = getUserById(id);
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPatronymic(request.patronymic());
        user.setDescription(request.description());
        return userRepository.save(user);
    }

    @Transactional
    @Override
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
    @Override
    public void setUserPassword(Long id, String password) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found")
        );
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }


    @Transactional
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    @Override
    public void setUserEmailConfirm(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found")
        );
        user.setEmailConfirm(true);
        userRepository.save(user);
    }
    @Transactional
    @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.HOURS)
    public void deleteUnconfirmedUsers(){
        userRepository.deleteAllByEmailConfirm(false);
    }

}
