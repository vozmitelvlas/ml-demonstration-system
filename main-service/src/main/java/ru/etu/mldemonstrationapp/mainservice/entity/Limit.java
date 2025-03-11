package ru.etu.mldemonstrationapp.mainservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "limits")
@Inheritance(strategy = InheritanceType.JOINED)
public class Limit implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long limitId;

    @Column(name = "rps_limit")
    @DecimalMin(value = "0", message = "rps must be greater than 0")
    @DecimalMax(value = "32767", message = "rps must be less than 32767")
    private Integer rps;

    @Column(name = "requests_per_week_limit")
    @DecimalMin(value = "0", message = "requestsPerWeek must be greater than 0")
    @DecimalMax(value = "32767", message = "requestsPerWeek must be less than 32767")
    private Integer requestsPerWeek;
}
