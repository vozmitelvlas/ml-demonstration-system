package ru.etu.mldemonstrationapp.mainservice.organizations;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.etu.mldemonstrationapp.mainservice.models.Limit;
import ru.etu.mldemonstrationapp.mainservice.models.Model;

import java.io.Serializable;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "models_organizations_limits")
public class ModelOrganizationLimit implements Serializable {
    @Id
    private Long limitId;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @PrimaryKeyJoinColumn(name = "limit_id")
    private Limit limit;
}