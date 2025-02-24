package ru.etu.mldemonstrationapp.mainservice.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
    boolean existsByName(String name);

    @Modifying
    @Query("""
            DELETE FROM Limit l
            WHERE l.limitId IN (
                SELECT m.limit.limitId FROM Model m
                JOIN Limit l ON l.limitId = m.limit.limitId
                WHERE m.modelId = :modelId)
             AND NOT EXISTS (
                SELECT m from Model m
                JOIN ModelVersion mv ON mv.model.modelId = m.modelId
                WHERE m.modelId = :modelId
            )
            """)
    void deleteModelIfVersionsListEmpty(Long modelId);
}
