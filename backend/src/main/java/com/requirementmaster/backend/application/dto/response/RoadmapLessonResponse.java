package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapLessonResponse {
    private Long id;
    private String title;
    private int orderIndex;
    private boolean isExam;
    private LessonStatus status;          // enum: LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED

    // presente si status == IN_PROGRESS (porcentaje de puntuación actual)
    private Integer currentProgressPercent;  // 0-100

    // presente si status == COMPLETED
    private Integer bestScore;                  // 0-100
    private Integer totalXp;                    // XP total acumulada en esta lección (todos los intentos)

    public enum LessonStatus {
        LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    }
}