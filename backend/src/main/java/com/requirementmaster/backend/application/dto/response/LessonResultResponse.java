package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.entities.Lesson;
import com.requirementmaster.backend.domain.entities.LessonProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResultResponse {

    private Long lessonId;
    private int pointsObtained;
    private int totalPoints = 100;
    private int percentScore;
    private boolean passed;
    private int xpEarned;
    private int timeTakenSeconds;
    private int lessonsCompletedCount;
    private boolean isExam;

    public static LessonResultResponse of(Lesson lesson,
                                          LessonProgress lessonProgress,
                                          int xpEarnedThisAttempt,
                                          int timeTakenSeconds,
                                          int lessonsCompletedCount) {
        if (lesson == null || lessonProgress == null) return null;

        int totalScore = lessonProgress.getTotalScore();
        boolean passed = totalScore >= 70;

        return LessonResultResponse.builder()
                .lessonId(lesson.getId())
                .pointsObtained(totalScore)
                .totalPoints(100)
                .percentScore(totalScore)
                .passed(passed)
                .xpEarned(xpEarnedThisAttempt)
                .timeTakenSeconds(timeTakenSeconds)
                .lessonsCompletedCount(lessonsCompletedCount)
                .isExam(lesson.isExam())
                .build();
    }
}