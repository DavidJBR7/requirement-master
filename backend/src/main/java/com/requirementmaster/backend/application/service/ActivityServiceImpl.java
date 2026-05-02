package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ActivityAnswerRequest;
import com.requirementmaster.backend.application.dto.response.ActivityResponse;
import com.requirementmaster.backend.domain.entities.Activity;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaActivityRepository;
import org.springframework.stereotype.Service;

@Service
public class ActivityServiceImpl implements ActivityService {

    private final JpaActivityRepository activityRepository;

    public ActivityServiceImpl(JpaActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @Override
    public ActivityResponse validateAnswer(Long activityId, ActivityAnswerRequest request) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new RuntimeException("Activity not found"));
        // Aquí iría la lógica de validación según el tipo de actividad
        boolean correct = false; // Placeholder
        int score = correct ? activity.getMaxScore() : 0;
        int xp = correct ? activity.getXpReward() : 0;
        return ActivityResponse.builder()
            .correct(correct)
            .score(score)
            .xpEarned(xp)
            .feedback(correct ? "¡Correcto!" : "Incorrecto. Intenta de nuevo.")
            .build();
    }
}
