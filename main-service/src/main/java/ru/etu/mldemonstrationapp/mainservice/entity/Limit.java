package ru.etu.mldemonstrationapp.mainservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "limits")
public class Limit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long limitId;

    @Column(name = "rps_limit")
    private Integer rps;

    @Column(name = "requests_per_week_limit")
    private Integer requestsPerWeek;
}
