package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResultResponse {
    private Long lessonId;
    private int pointsObtained;          // 0-100
    private int totalPoints = 100;
    private int percentScore;
    private boolean passed;              // ≥70
    private int xpEarned;               // XP ganada en este intento
    private int timeTakenSeconds;
    private int lessonsCompletedCount;   // cuántas lecciones completadas ahora
    private boolean isExam;
}