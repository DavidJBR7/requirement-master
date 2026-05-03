package com.requirementmaster.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "answer_records")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_progress_id", nullable = false)
    private ActivityProgress activityProgress;

    // Identificador de la pregunta dentro de la actividad (índice o clave del JSON)
    @Column(nullable = false)
    private String questionId;

    // Respuesta del usuario (puede ser String, JSON, etc.)
    @Column(columnDefinition = "TEXT")
    private String userAnswer;

    @Column(nullable = false)
    private boolean correct;

    // Puntos aportados a la nota de la lección (0..maxScore de la actividad)
    @Column(nullable = false)
    private int pointsAwarded;

    // XP generada por esta respuesta (0..maxXp de la actividad)
    @Column(nullable = false)
    private int xpAwarded;
}