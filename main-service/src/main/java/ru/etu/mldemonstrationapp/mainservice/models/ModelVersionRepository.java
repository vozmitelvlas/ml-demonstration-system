package ru.etu.mldemonstrationapp.mainservice.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelVersionRepository extends JpaRepository<ModelVersion, Long> {
    @Query("""
            SELECT count(mv.modelVersionId) > 0 FROM Model m
                JOIN ModelVersion mv ON mv.model.modelId = m.modelId
            WHERE m.modelId = :modelId AND mv.versionName = :name
            """)
    boolean versionNameUnique(Long modelId, String name);

    @Query("""
            SELECT mv FROM ModelOrganizationLimit mol
                JOIN mol.model m
                JOIN m.modelVersions mv
            WHERE mol.organization = :organization
            """)
    List<ModelVersion> findAllByOrganization(Organization organization);


    @Query("""
            SELECT mv FROM ModelOrganizationLimit mol
                JOIN mol.model m
                JOIN m.modelVersions mv
            WHERE mol.organization = :organization AND mv.modelVersionId = :id
            """)
    Optional<ModelVersion> findByIdAndOrganization(Long id, Organization organization);
}
