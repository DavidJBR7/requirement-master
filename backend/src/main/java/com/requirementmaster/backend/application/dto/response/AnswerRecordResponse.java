package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRecordResponse {
    private String questionId;
    private String userAnswer;   // representación serializada
    private boolean correct;
    private int pointsAwarded;
    private int xpAwarded;
}