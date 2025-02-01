package ru.etu.mldemonstrationapp.mainservice.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT r FROM Role r WHERE r.name IN :rolesNames")
    List<Role> findRolesByName(Iterable<String> rolesNames);
}
