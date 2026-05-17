package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.entities.LessonProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgressResponse {

    private boolean completed;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private int totalScore;
    private int bestScore;
    private int totalXpEarned;
    private int totalActivities;
    private int completedActivities;
    private int attempts;
    private int lastActivityOrder;
    private boolean finalized;

    public static LessonProgressResponse from(LessonProgress progress) {
        if (progress == null) return null;
        return LessonProgressResponse.builder()
                .completed(progress.isCompleted())
                .startedAt(progress.getStartedAt())
                .completedAt(progress.getCompletedAt())
                .totalScore(progress.getTotalScore())
                .bestScore(progress.getBestScore())
                .totalXpEarned(progress.getTotalXpEarned())
                .totalActivities(progress.getTotalActivities())
                .completedActivities(progress.getCompletedActivities())
                .attempts(progress.getAttempts())
                .lastActivityOrder(progress.getLastActivityOrder())
                .finalized(progress.isFinalized())
                .build();
    }
}