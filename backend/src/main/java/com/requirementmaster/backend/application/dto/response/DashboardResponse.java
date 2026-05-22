package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.enums.ActivityType;
import com.requirementmaster.backend.domain.enums.LessonProgressStatus;
import lombok.*;

import java.util.List;

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
        private double progressPercent;
        private int totalXp;
        private double averageBestScore;
    }

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LessonProgressItem {
        private Long lessonId;
        private String title;
        private LessonProgressStatus status;
        private int completedActivities;
        private int totalActivities;
    }

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Performance {
        private double globalAccuracy;
        private List<TypeBreakdown> byType;
        private BestLesson bestLesson;

        @Getter @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class TypeBreakdown {
            private ActivityType type;
            private double accuracy;
            private int totalXp;
            private int attempts;           // total de intentos de este tipo de actividad
        }

        @Getter @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class BestLesson {
            private Long lessonId;
            private String title;
            private int bestScore;
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