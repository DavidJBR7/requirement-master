package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.enums.ActivityType;
import com.requirementmaster.backend.domain.enums.LessonProgressStatus;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Summary summary;
    private List<LessonProgressItem> lessons;
    private Performance performance;
    private CurrentLessonInfo currentLesson;
    private String nextRecommendation;

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private int totalLessons;
        private int completedLessons;
        private double progressPercent;
        private int totalXp;
        private double averageBestScore;
        private int totalAttempts;
    }

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LessonProgressItem {
        private Long lessonId;
        private String title;
        private int order;
        private boolean isExam;
        private LessonProgressStatus status;
        private int bestScore;
        private int currentScore;
        private int xpEarned;
        private int completedActivities;
        private int totalActivities;
        private boolean finalized;
        private int lastActivityOrder;
    }

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Performance {
        private double globalAccuracy;
        private List<TypeBreakdown> byType;

        @Getter @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class TypeBreakdown {
            private ActivityType type;
            private double accuracy;
            private double avgScore;
            private int totalXp;
        }
    }

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CurrentLessonInfo {
        private Long lessonId;
        private String title;
        private int nextActivityOrder;
    }
}