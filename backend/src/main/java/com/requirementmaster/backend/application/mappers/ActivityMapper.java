package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.application.dto.response.ActivityResponse;
import com.requirementmaster.backend.application.dto.response.ActivitySummaryResponse;
import com.requirementmaster.backend.domain.entities.Activity;
import com.requirementmaster.backend.domain.entities.ActivityProgress;
import org.springframework.stereotype.Component;

@Component
public class ActivityMapper {

    public ActivityResponse toResponse(Activity activity, ActivityProgress progress, Integer maxAttempts) {
        ActivityResponse response = ActivityResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .type(activity.getType().name())
                .difficulty(activity.getDifficulty().name())
                .xpReward(activity.getXpReward())
                .maxScore(activity.getMaxScore())
                .orderIndex(activity.getOrderIndex())
                .configuration(activity.getConfiguration())
                .build();

        if (progress != null) {
            response.setIsCompleted(progress.isCompleted());
            response.setBestScore(progress.getScore());
            response.setAttemptsRemaining(maxAttempts - progress.getAttempts());
        } else {
            response.setAttemptsRemaining(maxAttempts);
            response.setIsCompleted(false);
        }

        return response;
    }

    public ActivitySummaryResponse toSummary(Activity activity, Boolean isCompleted) {
        return ActivitySummaryResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .type(activity.getType().name())
                .difficulty(activity.getDifficulty().name())
                .xpReward(activity.getXpReward())
                .orderIndex(activity.getOrderIndex())
                .isCompleted(isCompleted)
                .build();
    }
}