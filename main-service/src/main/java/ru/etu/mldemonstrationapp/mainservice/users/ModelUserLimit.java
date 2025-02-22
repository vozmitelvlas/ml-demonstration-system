package ru.etu.mldemonstrationapp.mainservice.users;

import jakarta.persistence.*;
import lombok.*;
import ru.etu.mldemonstrationapp.mainservice.models.Limit;
import ru.etu.mldemonstrationapp.mainservice.models.Model;

@Entity
@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Table(name = "models_users_limits")
public class ModelUserLimit extends Limit{
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
