package ru.etu.mldemonstrationapp.mainservice.users;

import jakarta.persistence.*;
import lombok.*;
import ru.etu.mldemonstrationapp.mainservice.models.Limit;
import ru.etu.mldemonstrationapp.mainservice.models.Model;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "models_users_limits")
public class ModelUserLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "limit_id", nullable = false)
    private Limit limit;
}
