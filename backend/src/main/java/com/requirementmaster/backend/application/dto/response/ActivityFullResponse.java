package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.entities.Activity;
import com.requirementmaster.backend.domain.entities.ActivityProgress;
import com.requirementmaster.backend.domain.enums.ActivityType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActivityFullResponse {

    private Long id;
    private String title;
    private String description;          // solo en detalle
    private ActivityType type;
    private int orderIndex;
    private int maxScore;
    private int maxXp;
    private boolean completed;           // para listados/resumen

    private Map<String, Object> configuration;      // solo en detalle
    private ActivityProgressResponse currentProgress; // solo en detalle

    public static ActivityFullResponse from(Activity activity, ActivityProgress progress) {
        if (activity == null) return null;

        ActivityFullResponse response = ActivityFullResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .type(activity.getType())
                .orderIndex(activity.getOrderIndex())
                .maxScore(activity.getMaxScore())
                .maxXp(activity.getMaxXp())
                .completed(progress != null && progress.isCompleted())
                .configuration(activity.getConfiguration())
                .currentProgress(ActivityProgressResponse.from(progress))
                .build();
        return response;
    }

    /**
     * Se usa desde el detalle de lección para listar actividades.
     */
    public static ActivityFullResponse summary(Activity activity, ActivityProgress progress) {
        if (activity == null) return null;
        ActivityFullResponse response = ActivityFullResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .type(activity.getType())
                .orderIndex(activity.getOrderIndex())
                .maxScore(activity.getMaxScore())
                .maxXp(activity.getMaxXp())
                .completed(progress != null && progress.isCompleted())
                .build();
        return response;
    }
}