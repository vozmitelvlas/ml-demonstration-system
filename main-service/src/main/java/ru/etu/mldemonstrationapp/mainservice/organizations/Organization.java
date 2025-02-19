package ru.etu.mldemonstrationapp.mainservice.organizations;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ru.etu.mldemonstrationapp.mainservice.organizations.dto.ModelOrganizationLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.users.User;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "organizations")
public class Organization implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long organizationId;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @OneToMany
    @JoinColumn(name = "organization_id")
    @JsonIgnore
    private List<User> members;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrganizationLimitsType limitsType;

    @OneToMany
    @JoinColumn(name = "organization_id")
    @JsonIgnore
    private List<ModelOrganizationLimit> limits = new ArrayList<>();

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;

    public List<ModelOrganizationLimitResponse> getModelsLimits() {
        return limits.stream().map(modelOrganizationLimit ->
                new ModelOrganizationLimitResponse(
                        modelOrganizationLimit,
                        modelOrganizationLimit.getModel().getModelId(),
                        modelOrganizationLimit.getModel().getName(),
                        "/api/models/%d".formatted(modelOrganizationLimit.getModel().getModelId())
                )).toList();
    }
}
