package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ActivityAnswerRequest;
import com.requirementmaster.backend.application.dto.response.ActivityResponse;

public interface ActivityService {
    ActivityResponse validateAnswer(Long activityId, ActivityAnswerRequest request);
}
