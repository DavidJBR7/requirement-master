package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.application.dto.response.DashboardResponse;
import com.requirementmaster.backend.application.dto.response.GlobalProgressResponse;
import com.requirementmaster.backend.domain.entities.GlobalProgress;
import com.requirementmaster.backend.shared.utils.DateUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ProgressMapper {

    @Value("${app.gamification.level.xp-per-level:500}")
    private int xpPerLevel;

    public GlobalProgressResponse toGlobalResponse(GlobalProgress progress) {
        if (progress == null) {
            return GlobalProgressResponse.builder()
                    .xpTotal(0)
                    .currentLevel(1)
                    .xpToNextLevel(xpPerLevel)
                    .lessonsCompleted(0)
                    .totalLessons(0)
                    .activitiesCompleted(0)
                    .totalActivities(0)
                    .averageScore(0.0)
                    .currentStreak(0)
                    .longestStreak(0)
                    .build();
        }

        int currentLevel = (progress.getXpTotal() / xpPerLevel) + 1;
        int xpInCurrentLevel = progress.getXpTotal() % xpPerLevel;
        int xpToNext = xpPerLevel - xpInCurrentLevel;

        return GlobalProgressResponse.builder()
                .xpTotal(progress.getXpTotal())
                .currentLevel(currentLevel)
                .xpToNextLevel(xpToNext)
                .lessonsCompleted(progress.getLessonsCompleted())
                .totalLessons(progress.getTotalLessons())
                .activitiesCompleted(progress.getActivitiesCompleted())
                .totalActivities(progress.getTotalActivities())
                .averageScore(progress.getAverageScore())
                .currentStreak(progress.getCurrentStreak())
                .longestStreak(progress.getLongestStreak())
                .lastActivityDate(DateUtils.formatColombia(progress.getLastActivityDate()))
                .build();
    }

    public DashboardResponse toDashboard(GlobalProgress global,
                                         java.util.List<com.requirementmaster.backend.application.dto.response.LessonProgressResponse> lessonsProgress) {
        return DashboardResponse.builder()
                .globalProgress(toGlobalResponse(global))
                .lessonsProgress(lessonsProgress)
                .build();
    }
}