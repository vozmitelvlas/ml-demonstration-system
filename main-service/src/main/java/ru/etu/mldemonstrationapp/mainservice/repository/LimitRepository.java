package ru.etu.mldemonstrationapp.mainservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.etu.mldemonstrationapp.mainservice.entity.Limit;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelOrganizationLimit;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelUserLimit;
import ru.etu.mldemonstrationapp.mainservice.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface LimitRepository extends JpaRepository<Limit, Long> {

    @Query("SELECT l FROM ModelOrganizationLimit l " +
            "JOIN l.organization o " +
            "JOIN l.model m " +
            "WHERE o.organizationId = :organizationId AND m.modelId = :modelId")
    Optional<ModelOrganizationLimit> findByOrganizationIdAndModelId(Long organizationId, Long modelId);

    @Query("SELECT l FROM ModelUserLimit l " +
            "JOIN l.user u " +
            "JOIN l.model m " +
            "WHERE u.userId = :userId AND m.modelId = :modelId")
    Optional<ModelUserLimit> findByUserIdAndModelId(Long userId, Long modelId);

    @Query("""
            SELECT mol, mul FROM User u
            INNER JOIN ModelOrganizationLimit mol ON mol.organization = u.organization
            LEFT JOIN ModelUserLimit mul ON mul.user = u and mul.model = mol.model
            WHERE u = :user
            """)
    List<Object[]> findLimitsForUser(User user);
}

