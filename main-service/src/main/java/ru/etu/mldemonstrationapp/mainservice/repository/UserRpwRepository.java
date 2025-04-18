package ru.etu.mldemonstrationapp.mainservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.entity.UserRpw;

import java.util.List;
import java.util.Optional;

public interface UserRpwRepository extends JpaRepository<UserRpw, Long> {

    void deleteAllByUser(@Param("user") User user);

    @Query("""
            SELECT ur FROM UserRpw ur
            JOIN ur.user u
            JOIN ur.model m
            WHERE u.organization.organizationId = :organizationId
              AND m.modelId = :modelId
            """)
    List<UserRpw> findAllByOrganizationAndModel(@Param("organizationId") Long organizationId, @Param("modelId") Long modelId);

    Optional<UserRpw> findByUserUserIdAndModelModelId(Long userId, Long modelId);

    @Modifying
    @Query("UPDATE UserRpw ur SET ur.currentRequests = 0")
    void updateCurrentRequestsToZero();
}
