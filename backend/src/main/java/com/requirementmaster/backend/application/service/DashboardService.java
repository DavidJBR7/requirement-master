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
        List<Lesson> allLessons = lessonRepository.findAllByOrderByOrderIndexAsc();

        List<LessonProgress> userLessonProgress = lessonProgressRepository.findAllByUserIdWithLesson(userId);
        Map<Long, LessonProgress> progressMap = userLessonProgress.stream()
                .collect(Collectors.toMap(lp -> lp.getLesson().getId(), lp -> lp));

        // --- Summary ---
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

        DashboardResponse.Summary summary = DashboardResponse.Summary.builder()
                .progressPercent(Math.round(progressPercent * 10.0) / 10.0)
                .totalXp(totalXp)
                .averageBestScore(Math.round(avgBestScore * 10.0) / 10.0)
                .build();

        // --- Lesson items (solo campos necesarios) ---
        List<DashboardResponse.LessonProgressItem> lessonItems = allLessons.stream()
                .map(lesson -> {
                    LessonProgress lp = progressMap.get(lesson.getId());
                    return DashboardResponse.LessonProgressItem.builder()
                            .lessonId(lesson.getId())
                            .title(lesson.getTitle())
                            .status(lp != null ? lp.getStatus() : LessonProgressStatus.LOCKED)
                            .completedActivities(lp != null ? lp.getCompletedActivities() : 0)
                            .totalActivities(lesson.getActivities().size())
                            .build();
                })
                .toList();

        // --- Performance global + por tipo (ahora con intentos) ---
        List<AnswerRecord> userAnswers = answerRecordRepository.findAllByUserIdWithRelations(userId);

        long totalAnswers = userAnswers.size();
        long correctAnswers = userAnswers.stream().filter(AnswerRecord::isCorrect).count();
        double globalAccuracy = totalAnswers == 0 ? 0 : (correctAnswers * 100.0) / totalAnswers;

        Map<ActivityType, List<AnswerRecord>> answersByType = userAnswers.stream()
                .collect(Collectors.groupingBy(ar -> ar.getActivityProgress().getActivity().getType()));

        // Obtener todos los ActivityProgress (incluye tanto activos como archivados)
        List<ActivityProgress> allUserProgress = activityProgressRepository.findAllByUserIdWithActivity(userId);
        Map<ActivityType, List<ActivityProgress>> progressByType = allUserProgress.stream()
                .collect(Collectors.groupingBy(ap -> ap.getActivity().getType()));

        List<DashboardResponse.Performance.TypeBreakdown> breakdowns = Arrays.stream(ActivityType.values())
                .map(type -> {
                    List<AnswerRecord> typeAnswers = answersByType.getOrDefault(type, List.of());
                    long typeTotal = typeAnswers.size();
                    long typeCorrect = typeAnswers.stream().filter(AnswerRecord::isCorrect).count();
                    double typeAccuracy = typeTotal == 0 ? 0 : (typeCorrect * 100.0) / typeTotal;

                    List<ActivityProgress> typeProgress = progressByType.getOrDefault(type, List.of());
                    int typeXp = typeProgress.stream().mapToInt(ActivityProgress::getXpEarned).sum();

                    // Intentos = número de ActivityProgress distintos de este tipo
                    int attempts = typeProgress.size();

                    return DashboardResponse.Performance.TypeBreakdown.builder()
                            .type(type)
                            .accuracy(Math.round(typeAccuracy * 10.0) / 10.0)
                            .totalXp(typeXp)
                            .attempts(attempts)
                            .build();
                })
                .toList();

        DashboardResponse.Performance performance = DashboardResponse.Performance.builder()
                .globalAccuracy(Math.round(globalAccuracy * 10.0) / 10.0)
                .byType(breakdowns)
                .build();

        // --- Current lesson & recommendation (sin cambios) ---
        List<LessonProgress> unfinalizedInProgress = lessonProgressRepository
                .findUnfinalizedInProgress(userId, LessonProgressStatus.IN_PROGRESS);

        DashboardResponse.CurrentLessonInfo currentLesson = null;
        String recommendation;

        if (!unfinalizedInProgress.isEmpty()) {
            // Caso 1: Hay una lección empezada pero no finalizada
            LessonProgress lp = unfinalizedInProgress.get(0);
            currentLesson = DashboardResponse.CurrentLessonInfo.builder()
                    .lessonId(lp.getLesson().getId())
                    .title(lp.getLesson().getTitle())
                    .nextActivityOrder(lp.getLastActivityOrder() + 1)
                    .build();
            recommendation = "Continúa con la lección «" + lp.getLesson().getTitle() + "»";

        } else {
            // 2. Buscar lecciones finalizadas pero suspendidas (reprobadas)
            Optional<LessonProgress> failedLesson = userLessonProgress.stream()
                    .filter(lp -> lp.isFinalized() && lp.getStatus() == LessonProgressStatus.AVAILABLE)
                    .min(Comparator.comparing(lp -> lp.getLesson().getOrderIndex()));

            if (failedLesson.isPresent()) {
                LessonProgress lp = failedLesson.get();
                currentLesson = DashboardResponse.CurrentLessonInfo.builder()
                        .lessonId(lp.getLesson().getId())
                        .title(lp.getLesson().getTitle())
                        .nextActivityOrder(1)  // empezar desde la primera actividad
                        .build();
                recommendation = "Repite la lección «" + lp.getLesson().getTitle()
                        + "» (necesitas 70% para aprobar)";

            } else {
                // 3. Buscar primera lección bloqueada o sin empezar
                Optional<Lesson> firstAvailable = allLessons.stream()
                        .filter(lesson -> {
                            LessonProgress lp = progressMap.get(lesson.getId());
                            return lp == null || lp.getStatus() == LessonProgressStatus.LOCKED;
                        })
                        .findFirst();

                if (firstAvailable.isPresent()) {
                    currentLesson = DashboardResponse.CurrentLessonInfo.builder()
                            .lessonId(firstAvailable.get().getId())
                            .title(firstAvailable.get().getTitle())
                            .nextActivityOrder(1)
                            .build();
                    recommendation = "Empieza la lección «" + firstAvailable.get().getTitle() + "»";
                } else {
                    // 4. Todo completado
                    currentLesson = null;
                    recommendation = "¡Has completado todas las lecciones!";
                }
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