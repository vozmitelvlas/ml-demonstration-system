package ru.etu.mldemonstrationapp.mainservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private Long modelId;

    private String runtime;

    private String problemType;
}
