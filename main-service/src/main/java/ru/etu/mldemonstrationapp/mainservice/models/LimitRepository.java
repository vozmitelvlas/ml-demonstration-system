package ru.etu.mldemonstrationapp.mainservice.models;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ru.etu.mldemonstrationapp.mainservice.organizations.ModelOrganizationLimit;
import ru.etu.mldemonstrationapp.mainservice.users.ModelUserLimit;

@Repository
public interface LimitRepository extends JpaRepository<Limit, Long> {
    Optional<ModelOrganizationLimit> findByOrganizationIdAndModelId(Long organizationId, Long modelId);
    Optional<ModelUserLimit> findByUserIdAndModelId(Long userId, Long modelId);
}

