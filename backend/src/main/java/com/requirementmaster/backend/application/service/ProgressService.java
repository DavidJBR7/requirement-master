package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.LessonResultResponse;
import com.requirementmaster.backend.application.mapper.LessonMapper;
import com.requirementmaster.backend.domain.entities.*;
import com.requirementmaster.backend.domain.exceptions.BusinessException;
import com.requirementmaster.backend.domain.exceptions.ResourceNotFoundException;
import com.requirementmaster.backend.infrastructure.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgressService {

    private final JpaLessonRepository lessonRepository;
    private final JpaLessonProgressRepository lessonProgressRepository;
    private final JpaActivityProgressRepository activityProgressRepository;
    private final JpaAnswerRecordRepository answerRecordRepository;
    private final JpaGlobalProgressRepository globalProgressRepository;
    private final LessonMapper lessonMapper;

    public LessonResultResponse finalizeLesson(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", lessonId));

        LessonProgress lp = lessonProgressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .orElseThrow(() -> new BusinessException("No has iniciado esta lección"));

        if (lp.isFinalized()) {
            throw new BusinessException("Esta lección ya ha sido finalizada");
        }

        // Calcular puntuación final (ya actualizada por las actividades)
        int totalScore = lp.getTotalScore();
        boolean passed = totalScore >= 70;

        // Guardar si la lección ya había sido completada en un intento anterior
        boolean wasAlreadyCompleted = lp.isCompleted();

        // Acumular XP de esta lección al progreso global (suma de XP de las actividades en este intento)
        List<ActivityProgress> activities = activityProgressRepository
                .findByUserIdAndActivity_LessonId(userId, lessonId);
        int xpEarnedThisAttempt = activities.stream().mapToInt(ActivityProgress::getXpEarned).sum();

        // Actualizar progreso de lección
        lp.setFinalized(true);
        lp.setAttempts(lp.getAttempts() + 1);
        if (totalScore > lp.getBestScore()) {
            lp.setBestScore(totalScore);
        }
        // Acumular XP total de la lección (histórica)
        lp.setTotalXpEarned(lp.getTotalXpEarned() + xpEarnedThisAttempt);

        if (passed && !lp.isCompleted()) {
            lp.setCompleted(true);
            lp.setCompletedAt(LocalDateTime.now());
        }
        lessonProgressRepository.save(lp);

        // Actualizar progreso global
        GlobalProgress gp = globalProgressRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("GlobalProgress not initialized"));
        gp.setXpTotal(gp.getXpTotal() + xpEarnedThisAttempt);
        gp.setLastActivityDate(LocalDateTime.now());

        // Si es lección (no examen) y se completa por primera vez, aumentar contador
        if (!lesson.isExam() && passed && !wasAlreadyCompleted) {
            gp.setLessonsCompleted(gp.getLessonsCompleted() + 1);
        }
        // Si es examen y fue aprobado, marcarlo
        if (lesson.isExam() && passed) {
            gp.setExamPassed(true);
        }
        globalProgressRepository.save(gp);

        int lessonsCompletedCount = gp.getLessonsCompleted();
        int timeTakenSeconds = calculateTimeTaken(lp);

        return lessonMapper.toResultResponse(lesson, lp, xpEarnedThisAttempt, timeTakenSeconds, lessonsCompletedCount);
    }

    public void resetLesson(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", lessonId));

        LessonProgress lp = lessonProgressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .orElseThrow(() -> new BusinessException("No hay progreso para reiniciar"));

        // Eliminar todos los registros de respuestas y progreso de actividades de esta lección
        List<ActivityProgress> activityProgressList = activityProgressRepository
                .findByUserIdAndActivity_LessonId(userId, lessonId);
        for (ActivityProgress ap : activityProgressList) {
            answerRecordRepository.deleteAll(ap.getAnswers());
            activityProgressRepository.delete(ap);
        }

        // Reiniciar el progreso de lección (conserva bestScore y totalXpEarned históricos)
        lp.setTotalScore(0);
        lp.setCompleted(false);
        lp.setCompletedAt(null);
        lp.setCompletedActivities(0);
        lp.setLastActivityOrder(0);
        lp.setFinalized(false);
        lp.setStartedAt(LocalDateTime.now()); // se considera nuevo intento
        // No se incrementa attempts aquí, solo en finalize
        lessonProgressRepository.save(lp);
    }

    private boolean wasLessonCompletedBefore(LessonProgress lp) {
        // Ya estaba marcado como completado en un intento anterior
        return lp.isCompleted() && lp.getAttempts() > 1;
    }

    private int calculateTimeTaken(LessonProgress lp) {
        if (lp.getStartedAt() != null && lp.getCompletedAt() != null) {
            return (int) java.time.Duration.between(lp.getStartedAt(), lp.getCompletedAt()).getSeconds();
        }
        return 0;
    }
}