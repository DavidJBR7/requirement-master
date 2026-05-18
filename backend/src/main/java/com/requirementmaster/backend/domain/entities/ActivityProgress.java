package com.requirementmaster.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "activity_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "activity_id"})
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    @Column(nullable = false)
    @Builder.Default
    private int score = 0;           // Puntos acumulados para la nota de la lección

    @Column(nullable = false)
    @Builder.Default
    private int xpEarned = 0;        // XP total obtenida en esta actividad (se asigna al finalizar)

    @Builder.Default
    @OneToMany(mappedBy = "activityProgress", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnswerRecord> answers = new ArrayList<>();
}