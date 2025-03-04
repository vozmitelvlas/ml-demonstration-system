package ru.etu.mldemonstrationapp.mainservice.organizations;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    boolean existsByName(String name);

    @Query("""
            SELECT count(u.userId) > 0 FROM User u
            JOIN Organization o ON u.organization.organizationId = o.organizationId
            WHERE o.organizationId = :id
            """)
    boolean containsUsers(Long id);

    @Query("""
            SELECT o.isEditable 
            FROM Organization o
            WHERE o.organizationId = :id
            """)
    boolean existsByIdAndIsEditableFalse(Long id);
}
