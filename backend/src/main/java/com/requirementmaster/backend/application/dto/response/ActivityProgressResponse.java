package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityProgressResponse {
    private boolean completed;
    private int score;           // puntos acumulados en la actividad (contribución a la nota)
    private int xpEarned;        // XP ganada en esta actividad (se consolida al finalizar)
    private int attempts;
    private int timeTakenSeconds;
    private LocalDateTime lastAttemptAt;
    private List<AnswerRecordResponse> answers;  // vacío si aún no hay respuestas
}