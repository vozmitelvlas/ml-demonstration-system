package ru.etu.mldemonstrationapp.mainservice.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    private String runtime;

    private String problemType;
}
