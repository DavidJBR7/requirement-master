package com.requirementmaster.backend.domain.entities;

import com.requirementmaster.backend.domain.enums.LessonProgressStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lesson_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private LessonProgressStatus status = LessonProgressStatus.LOCKED;

    @Column(nullable = false)
    @Builder.Default
    private int totalScore = 0;          // Puntuación actual (0-100)

    @Column(nullable = false)
    @Builder.Default
    private int bestScore = 0;           // Mejor puntuación histórica

    @Column(nullable = false)
    @Builder.Default
    private int totalXpEarned = 0;

    @Column(nullable = false)
    @Builder.Default
    private int totalActivities = 0;

    @Column(nullable = false)
    @Builder.Default
    private int completedActivities = 0;

    @Column(nullable = false)
    @Builder.Default
    private int attempts = 0;

    @Builder.Default
    private int lastActivityOrder = 0;   // Para pausa/reanudación

    // Indica si el usuario ya presionó "Finalizar lección" en el intento actual
    @Builder.Default
    private boolean finalized = false;
}