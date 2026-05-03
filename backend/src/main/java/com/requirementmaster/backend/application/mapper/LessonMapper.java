package com.requirementmaster.backend.application.mapper;

import com.requirementmaster.backend.application.dto.response.*;
import com.requirementmaster.backend.domain.entities.ActivityProgress;
import com.requirementmaster.backend.domain.entities.Lesson;
import com.requirementmaster.backend.domain.entities.LessonProgress;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class LessonMapper {

    private final ActivityMapper activityMapper;
    private final ProgressMapper progressMapper;

    /**
     * Construye un elemento del roadmap. Los parámetros ya vienen calculados por el servicio.
     */
    public RoadmapLessonResponse toRoadmapLessonResponse(Lesson lesson,
                                                         RoadmapLessonResponse.LessonStatus status,
                                                         Integer currentProgressPercent,
                                                         Integer bestScore,
                                                         Integer totalXp) {
        RoadmapLessonResponse response = new RoadmapLessonResponse();
        response.setId(lesson.getId());
        response.setTitle(lesson.getTitle());
        response.setOrderIndex(lesson.getOrderIndex());
        response.setExam(lesson.isExam());
        response.setStatus(status);

        if (status == RoadmapLessonResponse.LessonStatus.IN_PROGRESS) {
            response.setCurrentProgressPercent(currentProgressPercent);
        } else if (status == RoadmapLessonResponse.LessonStatus.COMPLETED) {
            response.setBestScore(bestScore);
            response.setTotalXp(totalXp);
        }
        return response;
    }

    /**
     * Vista detallada de una lección (teoría + lista de actividades + progreso).
     * La teoría se recibe como String porque puede venir de archivos externos.
     */
    public LessonDetailResponse toDetailResponse(Lesson lesson,
                                                 Map<Long, ActivityProgress> activityProgressMap,
                                                 LessonProgress lessonProgress) {
        if (lesson == null) return null;

        List<ActivitySummaryResponse> activities = lesson.getActivities() != null
                ? lesson.getActivities().stream()
                  .map(act -> {
                      ActivityProgress actProgress = activityProgressMap != null
                              ? activityProgressMap.get(act.getId()) : null;
                      return activityMapper.toSummaryResponse(act, actProgress);
                  })
                  .collect(Collectors.toList())
                : Collections.emptyList();

        return LessonDetailResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .orderIndex(lesson.getOrderIndex())
                .isExam(lesson.isExam())
                .activities(activities)
                .progress(progressMapper.toLessonProgressResponse(lessonProgress))
                .build();
    }

    /**
     * Métrica de una lección para el dashboard.
     */
    public LessonMetricsResponse toMetricsResponse(Lesson lesson,
                                                   LessonProgress progress,
                                                   int totalXp,
                                                   int timesRepeated) {
        if (lesson == null) return null;

        String status = "NOT_STARTED";
        if (progress != null) {
            status = progress.isCompleted() ? "COMPLETED" : "IN_PROGRESS";
        }

        return LessonMetricsResponse.builder()
                .lessonId(lesson.getId())
                .title(lesson.getTitle())
                .orderIndex(lesson.getOrderIndex())
                .isExam(lesson.isExam())
                .status(status)
                .bestScore(progress != null ? progress.getBestScore() : null)
                .totalXp(totalXp)
                .timesRepeated(timesRepeated)
                .lastCompletedAt(progress != null ? progress.getCompletedAt() : null)
                .build();
    }

    /**
     * Resultado tras finalizar una lección o examen.
     */
    public LessonResultResponse toResultResponse(Lesson lesson,
                                                 LessonProgress lessonProgress,
                                                 int xpEarnedThisAttempt,
                                                 int timeTakenSeconds,
                                                 int lessonsCompletedCount) {
        if (lesson == null || lessonProgress == null) return null;

        int totalScore = lessonProgress.getTotalScore();
        boolean passed = totalScore >= 70;

        return LessonResultResponse.builder()
                .lessonId(lesson.getId())
                .pointsObtained(totalScore)
                .totalPoints(100)
                .percentScore(totalScore)
                .passed(passed)
                .xpEarned(xpEarnedThisAttempt)
                .timeTakenSeconds(timeTakenSeconds)
                .lessonsCompletedCount(lessonsCompletedCount)
                .isExam(lesson.isExam())
                .build();
    }
}