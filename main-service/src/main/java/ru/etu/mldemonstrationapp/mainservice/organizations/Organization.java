package ru.etu.mldemonstrationapp.mainservice.organizations;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ru.etu.mldemonstrationapp.mainservice.users.User;

import java.io.Serializable;
import java.time.Instant;
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

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "organization_id")
    @JsonIgnore
    private List<User> members;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrganizationLimitsType limitsType;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;
}
