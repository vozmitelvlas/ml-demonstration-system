package ru.etu.mldemonstrationapp.mainservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_rpw")
public class UserRpw {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_rpw_id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "model_id")
    private Model model;

    @Column(name = "current_requests")
    private Integer currentRequests;


}
