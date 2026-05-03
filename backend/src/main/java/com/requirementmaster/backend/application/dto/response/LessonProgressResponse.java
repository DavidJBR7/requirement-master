package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgressResponse {
    private Long lessonId;
    private boolean completed;
    private String startedAt;
    private String completedAt;
    private Integer totalScore;
    private Integer completedActivities;
    private Integer totalActivities;
    private Integer attempts;
}