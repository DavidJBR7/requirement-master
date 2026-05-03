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
public class ActivitySummaryResponse {
    private Long id;
    private String title;
    private String type;
    private String difficulty;
    private Integer xpReward;
    private Integer orderIndex;
    private Boolean isCompleted;
}