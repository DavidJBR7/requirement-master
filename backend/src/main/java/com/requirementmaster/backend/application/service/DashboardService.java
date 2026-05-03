package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.*;
import com.requirementmaster.backend.application.mapper.LessonMapper;
import com.requirementmaster.backend.application.mapper.ProgressMapper;
import com.requirementmaster.backend.domain.entities.*;
import com.requirementmaster.backend.infrastructure.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final JpaGlobalProgressRepository globalProgressRepository;
    private final JpaLessonRepository lessonRepository;
    private final JpaLessonProgressRepository lessonProgressRepository;
    private final ProgressMapper progressMapper;
    private final LessonMapper lessonMapper;

    public DashboardResponse getDashboard(Long userId) {
        GlobalProgress gp = globalProgressRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Progreso global no encontrado"));

        List<Lesson> lessons = lessonRepository.findAllByOrderByOrderIndexAsc();
        List<LessonProgress> progressList = lessonProgressRepository.findByUserId(userId);

        List<LessonMetricsResponse> metrics = lessons.stream()
                .map(lesson -> {
                    LessonProgress lp = progressList.stream()
                            .filter(p -> p.getLesson().getId().equals(lesson.getId()))
                            .findFirst()
                            .orElse(null);

                    // XP total acumulada en la lección (histórica)
                    int totalXp = lp != null ? lp.getTotalXpEarned() : 0;
                    // Veces que ha repetido = número de intentos finalizados
                    int timesRepeated = lp != null ? lp.getAttempts() : 0;

                    return lessonMapper.toMetricsResponse(lesson, lp, totalXp, timesRepeated);
                })
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .globalProgress(progressMapper.toGlobalProgressResponse(gp))
                .lessonsMetrics(metrics)
                .build();
    }
}