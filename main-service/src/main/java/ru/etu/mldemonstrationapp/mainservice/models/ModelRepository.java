package ru.etu.mldemonstrationapp.mainservice.models;

import jakarta.persistence.OrderBy;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {
    boolean existsByName(String name);
}
