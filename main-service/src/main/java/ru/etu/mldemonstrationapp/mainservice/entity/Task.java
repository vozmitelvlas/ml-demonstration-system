package ru.etu.mldemonstrationapp.mainservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Table(name = "tasks")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID taskId;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @JsonIgnore
    private String outputPath;

    private Double executionTime;

    private String errorDescription;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "model_version_id", nullable = false)
    private ModelVersion modelVersion;

    private Instant completedAt;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;


    public Double getExecutionTime() {
        return completedAt != null
                ? Duration.between(getCreatedAt(), getCompletedAt()).toMillis() / 1000.0
                : Duration.between(getCreatedAt(), Instant.now()).toMillis() / 1000.0;
    }
}