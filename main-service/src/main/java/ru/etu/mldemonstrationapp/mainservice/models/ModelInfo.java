package ru.etu.mldemonstrationapp.mainservice.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "model_info")
public class ModelInfo implements Serializable {
    @Id
    private Long modelId;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @PrimaryKeyJoinColumn(name = "model_id")
    private Model model;

    private String runtime;

    private String problemType;
}
