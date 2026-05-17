package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.entities.ActivityProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityProgressResponse {

    private boolean completed;
    private int score;
    private int xpEarned;
    private int attempts;
    private int timeTakenSeconds;
    private LocalDateTime lastAttemptAt;
    private List<AnswerRecordResponse> answers;

    public static ActivityProgressResponse from(ActivityProgress progress) {
        if (progress == null) return null;
        return ActivityProgressResponse.builder()
                .completed(progress.isCompleted())
                .score(progress.getScore())
                .xpEarned(progress.getXpEarned())
                .attempts(progress.getAttempts())
                .timeTakenSeconds(progress.getTimeTakenSeconds())
                .lastAttemptAt(progress.getLastAttemptAt())
                .answers(progress.getAnswers() != null ?
                        progress.getAnswers().stream()
                        .map(AnswerRecordResponse::from)
                        .collect(Collectors.toList()) :
                        Collections.emptyList())
                .build();
    }
}