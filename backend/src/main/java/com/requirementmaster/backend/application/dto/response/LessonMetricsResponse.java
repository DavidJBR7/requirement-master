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
public class LessonMetricsResponse {
    private Long lessonId;
    private String title;
    private int orderIndex;
    private boolean isExam;
    private String status;               // "NOT_STARTED", "IN_PROGRESS", "COMPLETED"
    private Integer bestScore;           // null si nunca completada
    private int totalXp;                 // XP acumulada en todos los intentos de esta lección
    private int timesRepeated;           // número de intentos finalizados
    private LocalDateTime lastCompletedAt;
}