package ru.etu.mldemonstrationapp.mainservice.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelVersionRepository extends JpaRepository<ModelVersion, Long> {
    @Query("""
            SELECT new ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse(
                m.modelId, m.name, mv.modelVersionId, mv.versionName, mv.description, mv.uri,
                new ModelInfo(m_info.modelId, m_info.runtime, m_info.problemType),
                new Limit(l.limitId, l.rps, l.requestsPerWeek),
                mv.updatedAt, mv.createdAt
                )
            FROM ModelVersion mv
                LEFT JOIN Model m ON mv.model.modelId = m.modelId
                LEFT JOIN ModelInfo m_info ON m_info.modelId = m.modelId
                LEFT JOIN Limit l ON m.limit.limitId = l.limitId
            WHERE mv.modelVersionId = :id
           """
    )
    Optional<ModelVersionResponse> findModelVersionById(Long id);


    @Query("""
            SELECT new ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse(
                m.modelId, m.name, mv.modelVersionId, mv.versionName, mv.description, mv.uri,
                new ModelInfo(m_info.modelId, m_info.runtime, m_info.problemType),
                new Limit(l.limitId, l.rps, l.requestsPerWeek),
                mv.updatedAt, mv.createdAt
                )
            FROM ModelVersion mv
                LEFT JOIN Model m ON mv.model.modelId = m.modelId
                LEFT JOIN ModelInfo m_info ON m_info.modelId = m.modelId
                LEFT JOIN Limit l ON m.limit.limitId = l.limitId
           """
    )
    List<ModelVersionResponse> findModelVersions();
}
