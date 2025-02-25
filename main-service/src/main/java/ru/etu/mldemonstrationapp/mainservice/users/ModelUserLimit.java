package ru.etu.mldemonstrationapp.mainservice.users;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JsonIgnore
    private Model model;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
}
