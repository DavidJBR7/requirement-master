package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgressResponse {
    private boolean completed;              // ≥70% alcanzado alguna vez
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private int totalScore;                 // puntuación actual (0-100)
    private int bestScore;                  // mejor puntuación histórica
    private int totalXpEarned;
    private int totalActivities;
    private int completedActivities;
    private int attempts;                   // número de veces que se ha finalizado la lección
    private int lastActivityOrder;          // para pausa/reanudación
    private boolean finalized;               // true si ya presionó "Finalizar" en el intento actual
}