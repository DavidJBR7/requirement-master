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
        boolean previousCompleted = true;

        for (Lesson lesson : lessons) {
            LessonProgress progress = progressMap.get(lesson.getId());
            RoadmapLessonResponse.LessonStatus status;
            Integer currentPercent = null;
            Integer bestScore = null;
            Integer totalXp = null;

            if (!previousCompleted) {
                status = RoadmapLessonResponse.LessonStatus.LOCKED;
            } else if (progress == null) {
                status = RoadmapLessonResponse.LessonStatus.AVAILABLE;
            } else if (progress.getStatus() == LessonProgressStatus.COMPLETED) {
                status = RoadmapLessonResponse.LessonStatus.COMPLETED;
                bestScore = progress.getBestScore();
                totalXp = progress.getTotalXpEarned();
            } else if (progress.getStatus() == LessonProgressStatus.IN_PROGRESS && !progress.isFinalized()) {
                status = RoadmapLessonResponse.LessonStatus.IN_PROGRESS;
                int completed = progress.getCompletedActivities();
                int total = progress.getTotalActivities();
                currentPercent = total > 0 ? (completed * 100) / total : 0;
            } else {
                status = RoadmapLessonResponse.LessonStatus.AVAILABLE;
            }

            roadmap.add(RoadmapLessonResponse.of(lesson, status, currentPercent, bestScore, totalXp));

            if (!lesson.isExam()) {
                previousCompleted = (progress != null && progress.getStatus() == LessonProgressStatus.COMPLETED);
            }
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

        Map<Long, ActivityProgress> activityProgressMap = Collections.emptyMap();
        if (lessonProgress != null) {
            List<ActivityProgress> activityProgressList = activityProgressRepository
                    .findByUserIdAndActivity_LessonId(userId, lessonId);
            activityProgressMap = activityProgressList.stream()
                    .collect(Collectors.toMap(ap -> ap.getActivity().getId(), ap -> ap));
        }

        return LessonDetailResponse.of(lesson, activityProgressMap, lessonProgress);
    }
}