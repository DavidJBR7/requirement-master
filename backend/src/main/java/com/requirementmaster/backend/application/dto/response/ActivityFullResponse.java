package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.entities.Activity;
import com.requirementmaster.backend.domain.entities.ActivityProgress;
import com.requirementmaster.backend.domain.enums.ActivityType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActivityFullResponse {

    private Long id;
    private String title;
    private String description;
    private ActivityType type;
    private int orderIndex;
    private int maxScore;
    private int maxXp;
    private boolean completed;
    private int score;
    private int xpEarned;
    private Map<String, Object> configuration;
    private List<AnswerRecordResponse> answers;

    public static ActivityFullResponse from(Activity activity, ActivityProgress progress) {
        if (activity == null) return null;

        boolean isCompleted = progress != null && progress.isCompleted();
        int scoreVal = progress != null ? progress.getScore() : 0;
        int xpVal = progress != null ? progress.getXpEarned() : 0;
        List<AnswerRecordResponse> answerList = (progress != null && progress.getAnswers() != null) ?
                progress.getAnswers().stream()
                .map(AnswerRecordResponse::from)
                .collect(Collectors.toList()) :
                Collections.emptyList();

        return ActivityFullResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .type(activity.getType())
                .orderIndex(activity.getOrderIndex())
                .maxScore(activity.getMaxScore())
                .maxXp(activity.getMaxXp())
                .completed(isCompleted)
                .score(scoreVal)
                .xpEarned(xpVal)
                .configuration(activity.getConfiguration())
                .answers(answerList)
                .build();
    }
}