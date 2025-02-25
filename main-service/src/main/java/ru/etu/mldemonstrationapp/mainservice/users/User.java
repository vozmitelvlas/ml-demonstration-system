package ru.etu.mldemonstrationapp.mainservice.users;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ru.etu.mldemonstrationapp.mainservice.organizations.Organization;
import ru.etu.mldemonstrationapp.mainservice.users.dto.ModelUserLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.users.dto.OrganizationReferenceResponse;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String patronymic;

    private String description;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ModelUserLimit> limits = new ArrayList<>();

    @JsonIgnore
    public List<ModelUserLimitResponse> getModelsLimits() {
        return limits.stream().map(modelUserLimit ->
                new ModelUserLimitResponse(
                        modelUserLimit,
                        modelUserLimit.getModel().getModelId(),
                        modelUserLimit.getModel().getName(),
                        "/api/models/%d".formatted(modelUserLimit.getModel().getModelId())
                )).toList();
    }

    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    @JsonIgnore
    private Organization organization;

    @JsonProperty(value = "organization")
    public OrganizationReferenceResponse getOrganizationReference() {
        return new OrganizationReferenceResponse(
                organization.getOrganizationId(),
                organization.getName(),
                "/api/organizations/%d".formatted(organization.getOrganizationId())
        );
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles = new ArrayList<>();

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;
}
