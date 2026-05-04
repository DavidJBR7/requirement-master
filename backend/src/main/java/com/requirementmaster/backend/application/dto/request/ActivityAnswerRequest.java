package com.requirementmaster.backend.application.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ActivityAnswerRequest {

    @NotNull(message = "El ID de la actividad es obligatorio")
    @Positive(message = "ID de actividad inválido")
    private Long activityId;

    @NotNull(message = "El identificador de la pregunta es obligatorio")
    private String questionId;

    @NotNull(message = "La respuesta del usuario es obligatoria")
    private Object userAnswer;   // ← Cambiado a Object

    private Integer timeSpentSeconds;

    private int attemptNumber = 1;
}