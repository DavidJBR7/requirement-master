package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultResponse {
    private Long lessonId;
    private String lessonTitle;
    private Integer totalScore;
    private Integer maxScore;
    private Integer percentage;
    private Boolean passed;
    private Integer passingScore;
    private Boolean isRetryAllowed;
    private Integer attemptsUsed;
    private Integer maxAttempts;
    private String completedAt;
    private List<QuestionResult> questionResults;
    private String certificateUrl;  // Para exportar PDF

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionResult {
        private Long activityId;
        private String questionText;
        private Object userAnswer;
        private Object correctAnswer;
        private Boolean isCorrect;
        private Integer earnedScore;
        private String feedback;
    }
}