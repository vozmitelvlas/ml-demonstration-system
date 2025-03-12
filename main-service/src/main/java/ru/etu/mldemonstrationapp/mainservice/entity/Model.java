package ru.etu.mldemonstrationapp.mainservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "models")
public class Model implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long modelId;

    @Column(nullable = false)
    private String name;

    @OneToOne(mappedBy = "model", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private ModelInfo modelInfo;

    @OneToMany(mappedBy = "model", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ModelVersion> modelVersions = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "limit_id")
    private Limit limit;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;

    public ModelRuntime getRuntime() {
        return modelInfo.getRuntime();
    }

    public String getProblemType() {
        return modelInfo.getProblemType();
    }

    public List<String> getVersions() {
        return modelVersions.stream().map(version ->
                        "/api/models/%d/versions/%d".formatted(modelId, version.getModelVersionId()))
                .toList();

    }
}
