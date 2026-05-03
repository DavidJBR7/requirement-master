package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDetailResponse {
    private Long id;
    private String title;
    private String description;
    private int orderIndex;
    private boolean isExam;
    private List<ActivitySummaryResponse> activities;
    private LessonProgressResponse progress;  // puede ser null si no ha iniciado
}