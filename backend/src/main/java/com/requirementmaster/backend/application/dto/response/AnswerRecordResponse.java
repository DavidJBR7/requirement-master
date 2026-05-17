package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.entities.AnswerRecord;
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
    private String userAnswer;
    private boolean correct;
    private int pointsAwarded;
    private int xpAwarded;

    public static AnswerRecordResponse from(AnswerRecord record) {
        return AnswerRecordResponse.builder()
                .questionId(record.getQuestionId())
                .userAnswer(record.getUserAnswer())
                .correct(record.isCorrect())
                .pointsAwarded(record.getPointsAwarded())
                .xpAwarded(record.getXpAwarded())
                .build();
    }
}