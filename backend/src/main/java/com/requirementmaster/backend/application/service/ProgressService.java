package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.LessonDetailResponse;
import com.requirementmaster.backend.domain.entities.*;
import com.requirementmaster.backend.domain.enums.LessonProgressStatus;
import com.requirementmaster.backend.domain.exceptions.BusinessException;
import com.requirementmaster.backend.domain.exceptions.ResourceNotFoundException;
import com.requirementmaster.backend.infrastructure.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgressService {

    private final JpaLessonRepository lessonRepository;
    private final JpaLessonProgressRepository lessonProgressRepository;
    private final JpaActivityProgressRepository activityProgressRepository;
    private final JpaAnswerRecordRepository answerRecordRepository;

    public LessonDetailResponse finalizeLesson(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", lessonId));

        LessonProgress lp = lessonProgressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .orElseThrow(() -> new BusinessException("No has iniciado esta lección"));

        if (lp.isFinalized()) {
            throw new BusinessException("Esta lección ya ha sido finalizada");
        }

        int totalScore = lp.getTotalScore();
        boolean passed = totalScore >= 70;

        // Solo los ActivityProgress activos (intento actual)
        List<ActivityProgress> activities = activityProgressRepository
                .findByUserIdAndActivity_LessonIdAndActiveTrue(userId, lessonId);
        int xpEarnedThisAttempt = activities.stream().mapToInt(ActivityProgress::getXpEarned).sum();

        lp.setFinalized(true);
        lp.setAttempts(lp.getAttempts() + 1);
        if (totalScore > lp.getBestScore()) {
            lp.setBestScore(totalScore);
        }
        lp.setTotalXpEarned(lp.getTotalXpEarned() + xpEarnedThisAttempt);

        if (passed) {
            lp.setStatus(LessonProgressStatus.COMPLETED);
        } else {
            lp.setStatus(LessonProgressStatus.AVAILABLE);
        }
        lessonProgressRepository.save(lp);

        return LessonDetailResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .orderIndex(lesson.getOrderIndex())
                .isExam(lesson.isExam())
                .activities(null)
                .status(lp.getStatus())
                .finalized(lp.isFinalized())
                .totalScore(lp.getTotalScore())
                .bestScore(lp.getBestScore())
                .totalXpEarned(lp.getTotalXpEarned())
                .totalActivities(lp.getTotalActivities())
                .completedActivities(lp.getCompletedActivities())
                .attempts(lp.getAttempts())
                .lastActivityOrder(lp.getLastActivityOrder())
                .build();
    }

    public void resetLesson(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", lessonId));

        LessonProgress lp = lessonProgressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .orElseThrow(() -> new BusinessException("No hay progreso para reiniciar"));

        // Archivar todos los ActivityProgress activos de esta lección
        List<ActivityProgress> activeProgressList = activityProgressRepository
                .findByUserIdAndActivity_LessonIdAndActiveTrue(userId, lessonId);
        for (ActivityProgress ap : activeProgressList) {
            ap.setActive(false);
            activityProgressRepository.save(ap);
            // Los AnswerRecord asociados no se borran, se conservan para el histórico
        }

        // Reiniciar los contadores de la lección
        lp.setTotalScore(0);
        lp.setStatus(LessonProgressStatus.AVAILABLE);
        lp.setCompletedActivities(0);
        lp.setLastActivityOrder(0);
        lp.setFinalized(false);
        lessonProgressRepository.save(lp);
    }
}