package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivitySubmissionResponse {
    private boolean correct;
    private Integer earnedXp;
    private Integer earnedScore;
    private String feedback;
    private Integer attemptsRemaining;
    private Long nextActivityId;
    private Boolean isLessonCompleted;
    private String explanation;  // Para respuestas incorrectas
}