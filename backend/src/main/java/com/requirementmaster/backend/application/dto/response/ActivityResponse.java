package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    private Long id;
    private String title;
    private String description;
    private String type;
    private String difficulty;
    private Integer xpReward;
    private Integer maxScore;
    private Integer orderIndex;
    private Map<String, Object> configuration;
    private Integer attemptsRemaining;
    private Boolean isCompleted;
    private Integer bestScore;
}