package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private GlobalProgressResponse globalProgress;
    private List<LessonProgressResponse> lessonsProgress;
    private List<ActivitySubmissionResponse> recentActivities;
    private Map<String, Object> achievements;  // Logros desbloqueados
    private Integer rank;  // Posición en leaderboard (opcional)
}