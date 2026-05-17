package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.LessonResultResponse;
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

    public LessonResultResponse finalizeLesson(Long lessonId, Long userId) {
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
        boolean wasAlreadyCompleted = lp.isCompleted();

        List<ActivityProgress> activities = activityProgressRepository
                .findByUserIdAndActivity_LessonId(userId, lessonId);
        int xpEarnedThisAttempt = activities.stream().mapToInt(ActivityProgress::getXpEarned).sum();

        lp.setFinalized(true);
        lp.setAttempts(lp.getAttempts() + 1);
        if (totalScore > lp.getBestScore()) {
            lp.setBestScore(totalScore);
        }
        lp.setTotalXpEarned(lp.getTotalXpEarned() + xpEarnedThisAttempt);

        if (passed && !lp.isCompleted()) {
            lp.setCompleted(true);
            lp.setCompletedAt(LocalDateTime.now());
        }
        lessonProgressRepository.save(lp);

        GlobalProgress gp = globalProgressRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("GlobalProgress not initialized"));
        gp.setXpTotal(gp.getXpTotal() + xpEarnedThisAttempt);
        gp.setLastActivityDate(LocalDateTime.now());

        if (!lesson.isExam() && passed && !wasAlreadyCompleted) {
            gp.setLessonsCompleted(gp.getLessonsCompleted() + 1);
        }
        if (lesson.isExam() && passed) {
            gp.setExamPassed(true);
        }
        globalProgressRepository.save(gp);

        int timeTakenSeconds = 0;
        if (lp.getStartedAt() != null) {
            timeTakenSeconds = (int) java.time.Duration.between(lp.getStartedAt(), LocalDateTime.now()).getSeconds();
        }

        return LessonResultResponse.of(lesson, lp, xpEarnedThisAttempt, timeTakenSeconds, gp.getLessonsCompleted());
    }

    public void resetLesson(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", lessonId));

        LessonProgress lp = lessonProgressRepository
                .findByUserIdAndLessonId(userId, lessonId)
                .orElseThrow(() -> new BusinessException("No hay progreso para reiniciar"));

        List<ActivityProgress> activityProgressList = activityProgressRepository
                .findByUserIdAndActivity_LessonId(userId, lessonId);
        for (ActivityProgress ap : activityProgressList) {
            answerRecordRepository.deleteAll(ap.getAnswers());
            activityProgressRepository.delete(ap);
        }

        lp.setTotalScore(0);
        lp.setCompleted(false);
        lp.setCompletedAt(null);
        lp.setCompletedActivities(0);
        lp.setLastActivityOrder(0);
        lp.setFinalized(false);
        lp.setStartedAt(LocalDateTime.now());
        lessonProgressRepository.save(lp);
    }
}