package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalProgressResponse {
    private int xpTotal;
    private int lessonsCompleted;        // 0-5
    private int totalLessons = 5;
    private boolean examPassed;
}