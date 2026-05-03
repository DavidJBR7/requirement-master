package com.requirementmaster.backend.application.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityAnswerRequest {
    @NotNull(message = "El ID de la actividad es obligatorio")
    @Positive(message = "ID de actividad inválido")
    private Long activityId;

    @NotNull(message = "El ID o índice de la pregunta es obligatorio")
    private Object questionId;

    @NotNull(message = "La respuesta del usuario es obligatoria")
    private Object userAnswer;

    private Integer timeSpentSeconds;

    @Builder.Default
    private int attemptNumber = 1;
}