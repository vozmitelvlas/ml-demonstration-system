package ru.etu.mldemonstrationapp.mainservice.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "model_versions")
public class ModelVersion implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long modelVersionId;

    @Column(nullable = false)
    private String versionName;

    private String description;

    @Column(nullable = false)
    private String uri;

    @ManyToOne
    @JoinColumn(name = "model_id")
    @JsonIgnore
    private Model model;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;

    public Long getModelId() {
        return model.getModelId();
    }

    public String getModelName() {
        return model.getName();
    }

    public String getRuntime() {
        return model.getRuntime();
    }

    public String getProblemType() {
        return model.getProblemType();
    }

    public Limit getLimit() {
        return model.getLimit();
    }
}
