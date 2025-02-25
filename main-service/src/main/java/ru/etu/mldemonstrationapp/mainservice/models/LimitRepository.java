package ru.etu.mldemonstrationapp.mainservice.models;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ru.etu.mldemonstrationapp.mainservice.organizations.ModelOrganizationLimit;
import ru.etu.mldemonstrationapp.mainservice.users.ModelUserLimit;

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

    @Query("SELECT l FROM ModelUserLimit l JOIN l.user u WHERE u.userId = :userId")
    Optional<ModelUserLimit> findAllByUserId(Long userId);
}

