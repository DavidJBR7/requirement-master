package com.requirementmaster.backend.application.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
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

    // Identificador de la pregunta dentro de la actividad (p.ej. "q0", "pair1", "item3")
    @NotNull(message = "El identificador de la pregunta es obligatorio")
    private String questionId;

    @NotNull(message = "La respuesta del usuario es obligatoria")
    private JsonNode userAnswer;

    private Integer timeSpentSeconds;

    @Builder.Default
    private int attemptNumber = 1;
}