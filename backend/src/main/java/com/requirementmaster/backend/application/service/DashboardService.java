package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.DashboardResponse;
import com.requirementmaster.backend.domain.entities.*;
import com.requirementmaster.backend.domain.enums.LessonProgressStatus;
import com.requirementmaster.backend.domain.enums.ActivityType;
import com.requirementmaster.backend.infrastructure.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final JpaLessonRepository lessonRepository;
    private final JpaLessonProgressRepository lessonProgressRepository;
    private final JpaActivityProgressRepository activityProgressRepository;
    private final JpaAnswerRecordRepository answerRecordRepository;

    public DashboardResponse getUserDashboard(Long userId) {
        // 1. Obtener todas las lecciones ordenadas
        List<Lesson> allLessons = lessonRepository.findAllByOrderByOrderIndexAsc();

        // 2. Obtener progreso de lecciones del usuario con fetch de Lesson
        List<LessonProgress> userLessonProgress = lessonProgressRepository.findAllByUserIdWithLesson(userId);
        Map<Long, LessonProgress> progressMap = userLessonProgress.stream()
                .collect(Collectors.toMap(lp -> lp.getLesson().getId(), lp -> lp));

        // 3. Resumen general
        int totalLessons = allLessons.size();
        long completedCount = userLessonProgress.stream()
                .filter(lp -> lp.getStatus() == LessonProgressStatus.COMPLETED)
                .count();
        double progressPercent = totalLessons == 0 ? 0 : (completedCount * 100.0) / totalLessons;

        int totalXp = userLessonProgress.stream()
                .mapToInt(LessonProgress::getTotalXpEarned)
                .sum();

        double avgBestScore = userLessonProgress.stream()
                .filter(lp -> lp.getStatus() != LessonProgressStatus.LOCKED)
                .mapToInt(LessonProgress::getBestScore)
                .average()
                .orElse(0);

        int totalAttempts = userLessonProgress.stream()
                .mapToInt(LessonProgress::getAttempts)
                .sum();

        DashboardResponse.Summary summary = DashboardResponse.Summary.builder()
                .totalLessons(totalLessons)
                .completedLessons((int) completedCount)
                .progressPercent(Math.round(progressPercent * 10.0) / 10.0)
                .totalXp(totalXp)
                .averageBestScore(Math.round(avgBestScore * 10.0) / 10.0)
                .totalAttempts(totalAttempts)
                .build();

        // 4. Progreso por lección
        List<DashboardResponse.LessonProgressItem> lessonItems = allLessons.stream()
                .map(lesson -> {
                    LessonProgress lp = progressMap.get(lesson.getId());
                    return DashboardResponse.LessonProgressItem.builder()
                            .lessonId(lesson.getId())
                            .title(lesson.getTitle())
                            .order(lesson.getOrderIndex())
                            .isExam(lesson.isExam())
                            .totalActivities(lesson.getActivities().size())
                            .status(lp != null ? lp.getStatus() : LessonProgressStatus.LOCKED)
                            .bestScore(lp != null ? lp.getBestScore() : 0)
                            .currentScore(lp != null ? lp.getTotalScore() : 0)
                            .xpEarned(lp != null ? lp.getTotalXpEarned() : 0)
                            .completedActivities(lp != null ? lp.getCompletedActivities() : 0)
                            .finalized(lp != null && lp.isFinalized())
                            .lastActivityOrder(lp != null ? lp.getLastActivityOrder() : 0)
                            .build();
                })
                .toList();

        // 5. Rendimiento global y por tipo de actividad
        List<AnswerRecord> userAnswers = answerRecordRepository.findAllByUserIdWithRelations(userId);

        long totalAnswers = userAnswers.size();
        long correctAnswers = userAnswers.stream().filter(AnswerRecord::isCorrect).count();
        double globalAccuracy = totalAnswers == 0 ? 0 : (correctAnswers * 100.0) / totalAnswers;

        // Agrupar respuestas por tipo de actividad
        Map<ActivityType, List<AnswerRecord>> answersByType = userAnswers.stream()
                .collect(Collectors.groupingBy(ar -> ar.getActivityProgress().getActivity().getType()));

        // Obtener todos los progresos de actividad del usuario para métricas de puntuación/XP
        List<ActivityProgress> userActivityProgress = activityProgressRepository.findAllByUserIdWithActivity(userId);
        Map<ActivityType, List<ActivityProgress>> progressByType = userActivityProgress.stream()
                .collect(Collectors.groupingBy(ap -> ap.getActivity().getType()));

        List<DashboardResponse.Performance.TypeBreakdown> breakdowns = Arrays.stream(ActivityType.values())
                .map(type -> {
                    List<AnswerRecord> typeAnswers = answersByType.getOrDefault(type, List.of());
                    long typeTotal = typeAnswers.size();
                    long typeCorrect = typeAnswers.stream().filter(AnswerRecord::isCorrect).count();
                    double typeAccuracy = typeTotal == 0 ? 0 : (typeCorrect * 100.0) / typeTotal;

                    List<ActivityProgress> typeProgress = progressByType.getOrDefault(type, List.of());
                    double avgScore = typeProgress.isEmpty() ? 0 :
                            typeProgress.stream().mapToInt(ActivityProgress::getScore).average().orElse(0);
                    int typeXp = typeProgress.stream().mapToInt(ActivityProgress::getXpEarned).sum();

                    return DashboardResponse.Performance.TypeBreakdown.builder()
                            .type(type)
                            .accuracy(Math.round(typeAccuracy * 10.0) / 10.0)
                            .avgScore(Math.round(avgScore * 10.0) / 10.0)
                            .totalXp(typeXp)
                            .build();
                })
                .toList();

        DashboardResponse.Performance performance = DashboardResponse.Performance.builder()
                .globalAccuracy(Math.round(globalAccuracy * 10.0) / 10.0)
                .byType(breakdowns)
                .build();

        // 6. Lección actual y recomendación
        List<LessonProgress> unfinalizedInProgress = lessonProgressRepository
                .findUnfinalizedInProgress(userId, LessonProgressStatus.IN_PROGRESS);

        DashboardResponse.CurrentLessonInfo currentLesson = null;
        String recommendation;

        if (!unfinalizedInProgress.isEmpty()) {
            // Tomamos la primera (por orden de lección) – ya podrías ordenarlas aquí si hiciera falta
            LessonProgress lp = unfinalizedInProgress.get(0);
            currentLesson = DashboardResponse.CurrentLessonInfo.builder()
                    .lessonId(lp.getLesson().getId())
                    .title(lp.getLesson().getTitle())
                    .nextActivityOrder(lp.getLastActivityOrder() + 1)
                    .build();
            recommendation = "Continúa con la lección «" + lp.getLesson().getTitle() + "»";
        } else {
            // Buscar la primera lección sin progreso o bloqueada
            Optional<Lesson> firstLocked = allLessons.stream()
                    .filter(lesson -> {
                        LessonProgress lp = progressMap.get(lesson.getId());
                        return lp == null || lp.getStatus() == LessonProgressStatus.LOCKED;
                    })
                    .findFirst();
            if (firstLocked.isPresent()) {
                recommendation = "Empieza la lección «" + firstLocked.get().getTitle() + "»";
            } else {
                recommendation = "¡Has completado todas las lecciones!";
            }
        }

        return DashboardResponse.builder()
                .summary(summary)
                .lessons(lessonItems)
                .performance(performance)
                .currentLesson(currentLesson)
                .nextRecommendation(recommendation)
                .build();
    }
}