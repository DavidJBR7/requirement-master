package com.requirementmaster.backend.application.mapper;

import com.requirementmaster.backend.application.dto.response.*;
import com.requirementmaster.backend.domain.entities.ActivityProgress;
import com.requirementmaster.backend.domain.entities.AnswerRecord;
import com.requirementmaster.backend.domain.entities.GlobalProgress;
import com.requirementmaster.backend.domain.entities.LessonProgress;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProgressMapper {

    // --- GlobalProgress ---
    public GlobalProgressResponse toGlobalProgressResponse(GlobalProgress globalProgress) {
        if (globalProgress == null) return null;
        return GlobalProgressResponse.builder()
                .xpTotal(globalProgress.getXpTotal())
                .lessonsCompleted(globalProgress.getLessonsCompleted())
                .totalLessons(5)
                .examPassed(globalProgress.isExamPassed())
                .build();
    }

    // --- LessonProgress ---
    public LessonProgressResponse toLessonProgressResponse(LessonProgress progress) {
        if (progress == null) return null;
        return LessonProgressResponse.builder()
                .completed(progress.isCompleted())
                .startedAt(progress.getStartedAt())
                .completedAt(progress.getCompletedAt())
                .totalScore(progress.getTotalScore())
                .bestScore(progress.getBestScore())
                .totalActivities(progress.getTotalActivities())
                .completedActivities(progress.getCompletedActivities())
                .attempts(progress.getAttempts())
                .lastActivityOrder(progress.getLastActivityOrder())
                .finalized(progress.isFinalized())
                .totalXpEarned(progress.getTotalXpEarned())
                .build();
    }

    // --- ActivityProgress ---
    public ActivityProgressResponse toActivityProgressResponse(ActivityProgress progress) {
        if (progress == null) return null;
        return ActivityProgressResponse.builder()
                .completed(progress.isCompleted())
                .score(progress.getScore())
                .xpEarned(progress.getXpEarned())
                .attempts(progress.getAttempts())
                .timeTakenSeconds(progress.getTimeTakenSeconds())
                .lastAttemptAt(progress.getLastAttemptAt())
                .answers(toAnswerRecordResponseList(progress.getAnswers()))
                .build();
    }

    // --- AnswerRecord (lista) ---
    private List<AnswerRecordResponse> toAnswerRecordResponseList(List<AnswerRecord> answers) {
        if (answers == null) return Collections.emptyList();
        return answers.stream()
                .map(this::toAnswerRecordResponse)
                .collect(Collectors.toList());
    }

    private AnswerRecordResponse toAnswerRecordResponse(AnswerRecord record) {
        return AnswerRecordResponse.builder()
                .questionId(record.getQuestionId())
                .userAnswer(record.getUserAnswer())
                .correct(record.isCorrect())
                .pointsAwarded(record.getPointsAwarded())
                .xpAwarded(record.getXpAwarded())
                .build();
    }
}