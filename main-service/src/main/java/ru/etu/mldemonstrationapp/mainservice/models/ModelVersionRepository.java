package ru.etu.mldemonstrationapp.mainservice.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ModelVersionRepository extends JpaRepository<ModelVersion, Long> {
    @Query("""
            SELECT count(mv.modelVersionId) > 0 FROM Model m
                JOIN ModelVersion mv ON mv.model.modelId = m.modelId
            WHERE m.modelId = :modelId AND mv.versionName = :name
            """)
    boolean versionNameUnique(Long modelId, String name);

}
