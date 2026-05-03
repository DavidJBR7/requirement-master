package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalProgressResponse {
    private Integer xpTotal;
    private Integer currentLevel;
    private Integer xpToNextLevel;
    private Integer lessonsCompleted;
    private Integer totalLessons;
    private Integer activitiesCompleted;
    private Integer totalActivities;
    private Double averageScore;
    private Integer currentStreak;
    private Integer longestStreak;
    private String lastActivityDate;
}