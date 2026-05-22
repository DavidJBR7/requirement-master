package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.*;
import com.requirementmaster.backend.domain.entities.*;
import com.requirementmaster.backend.domain.enums.LessonProgressStatus;
import com.requirementmaster.backend.domain.exceptions.BusinessException;
import com.requirementmaster.backend.domain.exceptions.ResourceNotFoundException;
import com.requirementmaster.backend.infrastructure.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonService {

    private final JpaLessonRepository lessonRepository;
    private final JpaLessonProgressRepository lessonProgressRepository;
    private final JpaActivityProgressRepository activityProgressRepository;
    private final JpaActivityRepository activityRepository;

    public List<RoadmapLessonResponse> getRoadmap(Long userId) {
        List<Lesson> lessons = lessonRepository.findAllByOrderByOrderIndexAsc();
        Map<Long, LessonProgress> progressMap = lessonProgressRepository.findByUserId(userId)
                .stream()
                .collect(Collectors.toMap(lp -> lp.getLesson().getId(), lp -> lp));

        List<RoadmapLessonResponse> roadmap = new ArrayList<>();

        for (Lesson lesson : lessons) {
            LessonProgress progress = progressMap.get(lesson.getId());

            // Usar la misma lógica centralizada para determinar el estado
            LessonProgressStatus effectiveStatus = determineEffectiveStatus(lesson, userId, progress);

            Integer currentPercent = null;
            Integer bestScore = null;
            Integer totalXp = null;

            // Mapear el estado interno al estado del roadmap
            RoadmapLessonResponse.LessonStatus roadmapStatus = mapToRoadmapStatus(effectiveStatus, progress);

            if (roadmapStatus == RoadmapLessonResponse.LessonStatus.COMPLETED && progress != null) {
                bestScore = progress.getBestScore();
                totalXp = progress.getTotalXpEarned();
            } else if (roadmapStatus == RoadmapLessonResponse.LessonStatus.IN_PROGRESS && progress != null) {
                int completed = progress.getCompletedActivities();
                int total = progress.getTotalActivities();
                currentPercent = total > 0 ? (completed * 100) / total : 0;
            }

            roadmap.add(RoadmapLessonResponse.of(lesson, roadmapStatus, currentPercent, bestScore, totalXp));
        }

        return roadmap;
    }

    public LessonDetailResponse getLessonDetail(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", lessonId));

        LessonProgress lessonProgress = lessonProgressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .orElse(null);

        if (lesson.isExam() && lessonProgress != null && !lessonProgress.isFinalized()) {
            throw new BusinessException(
                    "El examen debe completarse en una sola sesión. Debes reiniciarlo para intentarlo de nuevo."
            );
        }

        LessonProgressStatus effectiveStatus = determineEffectiveStatus(lesson, userId, lessonProgress);

        Map<Long, ActivityProgress> activityProgressMap = Collections.emptyMap();
        if (lessonProgress != null) {
            // Solo progreso activo (sesión actual)
            List<ActivityProgress> activityProgressList = activityProgressRepository
                    .findByUserIdAndActivity_LessonIdAndActiveTrue(userId, lessonId);
            activityProgressMap = activityProgressList.stream()
                    .collect(Collectors.toMap(ap -> ap.getActivity().getId(), ap -> ap));
        }

        return LessonDetailResponse.of(lesson, activityProgressMap, lessonProgress, effectiveStatus);
    }

    /**
     * Determina el estado real de una lección considerando:
     * 1. Si existe progreso, usa el estado guardado
     * 2. Si no existe progreso, verifica la cadena de desbloqueo
     */
    private LessonProgressStatus determineEffectiveStatus(Lesson lesson, Long userId, LessonProgress progress) {
        // Si ya existe progreso, usar el estado real de la BD
        if (progress != null) {
            return progress.getStatus();
        }

        // Sin progreso: verificar si debería estar disponible o bloqueada
        if (isLessonUnlocked(lesson, userId)) {
            return LessonProgressStatus.AVAILABLE;
        } else {
            return LessonProgressStatus.LOCKED;
        }
    }

    /**
     * Verifica si una lección está desbloqueada para un usuario
     * basándose en la cadena de prerrequisitos.
     */
    private boolean isLessonUnlocked(Lesson lesson, Long userId) {
        // La primera lección siempre está disponible
        if (lesson.getOrderIndex() == 1) {
            return true;
        }

        // Buscar la lección no-examen inmediatamente anterior
        Optional<Lesson> previousLesson = lessonRepository
                .findTopByOrderIndexLessThanAndIsExamFalseOrderByOrderIndexDesc(lesson.getOrderIndex());

        // Si no hay lección anterior, está disponible
        if (previousLesson.isEmpty()) {
            return true;
        }

        // Verificar si la lección anterior está completada
        return lessonProgressRepository
                .findByUserIdAndLessonId(userId, previousLesson.get().getId())
                .map(lp -> lp.getStatus() == LessonProgressStatus.COMPLETED)
                .orElse(false);
    }

    /**
     * Mapea el LessonProgressStatus interno al estado del roadmap.
     */
    private RoadmapLessonResponse.LessonStatus mapToRoadmapStatus(
            LessonProgressStatus effectiveStatus,
            LessonProgress progress) {

        return switch (effectiveStatus) {
            case COMPLETED -> RoadmapLessonResponse.LessonStatus.COMPLETED;
            case IN_PROGRESS -> {
                if (progress != null && progress.isFinalized()) {
                    yield RoadmapLessonResponse.LessonStatus.AVAILABLE;
                }
                yield RoadmapLessonResponse.LessonStatus.IN_PROGRESS;
            }
            case LOCKED -> RoadmapLessonResponse.LessonStatus.LOCKED;
            case AVAILABLE -> RoadmapLessonResponse.LessonStatus.AVAILABLE;
            default -> RoadmapLessonResponse.LessonStatus.AVAILABLE;
        };
    }
}