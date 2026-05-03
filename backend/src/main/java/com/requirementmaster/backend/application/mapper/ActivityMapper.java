package com.requirementmaster.backend.application.mapper;

import com.requirementmaster.backend.application.dto.response.ActivityFullResponse;
import com.requirementmaster.backend.application.dto.response.ActivitySummaryResponse;
import com.requirementmaster.backend.domain.entities.Activity;
import com.requirementmaster.backend.domain.entities.ActivityProgress;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActivityMapper {

    private final ProgressMapper progressMapper;

    public ActivitySummaryResponse toSummaryResponse(Activity activity) {
        if (activity == null) return null;
        return ActivitySummaryResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .type(activity.getType())
                .orderIndex(activity.getOrderIndex())
                .maxScore(activity.getMaxScore())
                .maxXp(activity.getMaxXp())
                .completed(false) // se actualizará externamente si hay progreso
                .build();
    }

    public ActivitySummaryResponse toSummaryResponse(Activity activity, ActivityProgress progress) {
        ActivitySummaryResponse response = toSummaryResponse(activity);
        if (response != null) {
            response.setCompleted(progress != null && progress.isCompleted());
        }
        return response;
    }

    public ActivityFullResponse toFullResponse(Activity activity, ActivityProgress progress) {
        if (activity == null) return null;
        return ActivityFullResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .type(activity.getType())
                .orderIndex(activity.getOrderIndex())
                .maxScore(activity.getMaxScore())
                .maxXp(activity.getMaxXp())
                .configuration(activity.getConfiguration())
                .currentProgress(progressMapper.toActivityProgressResponse(progress))
                .build();
    }
}