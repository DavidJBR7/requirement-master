package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.DashboardResponse;
import com.requirementmaster.backend.application.dto.response.ProgressResponse;

public interface ProgressService {
    ProgressResponse getUserProgress(Long userId);
    DashboardResponse getDashboard(Long userId);
}
