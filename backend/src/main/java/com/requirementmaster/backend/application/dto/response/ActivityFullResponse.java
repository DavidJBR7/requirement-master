package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.enums.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityFullResponse {
    private Long id;
    private String title;
    private String description;
    private ActivityType type;
    private int orderIndex;
    private int maxScore;
    private int maxXp;
    private Map<String, Object> configuration;  // preguntas, opciones, etc.
    private ActivityProgressResponse currentProgress;  // null si no iniciada
}