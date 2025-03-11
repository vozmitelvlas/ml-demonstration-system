package ru.etu.mldemonstrationapp.mainservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.etu.mldemonstrationapp.mainservice.entity.Role;
import ru.etu.mldemonstrationapp.mainservice.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT r FROM Role r WHERE r.name IN :rolesNames")
    List<Role> findRolesByName(Iterable<String> rolesNames);

    boolean existsByLogin(String login);

    boolean existsByEmail(String email);

    Optional<User> findByLogin(String login);

    Optional<User> findByEmail(String email);
}
