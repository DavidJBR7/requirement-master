package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.entities.ActivityProgress;
import com.requirementmaster.backend.domain.entities.Lesson;
import com.requirementmaster.backend.domain.entities.LessonProgress;
import com.requirementmaster.backend.domain.enums.LessonProgressStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDetailResponse {

    private Long id;
    private String title;
    private String description;
    private int orderIndex;
    private boolean isExam;
    private List<ActivityFullResponse> activities;

    // Merged progress fields
    private LessonProgressStatus status;
    private boolean finalized;
    private int totalScore;
    private int bestScore;
    private int totalXpEarned;
    private int totalActivities;
    private int completedActivities;
    private int attempts;
    private int lastActivityOrder;

    public static LessonDetailResponse of(Lesson lesson,
                                          Map<Long, ActivityProgress> activityProgressMap,
                                          LessonProgress lessonProgress) {
        if (lesson == null) return null;

        List<ActivityFullResponse> activities = lesson.getActivities() != null
                ? lesson.getActivities().stream()
                  .map(act -> {
                      ActivityProgress ap = activityProgressMap != null
                              ? activityProgressMap.get(act.getId()) : null;
                      return ActivityFullResponse.from(act, ap);
                  })
                  .collect(Collectors.toList())
                : Collections.emptyList();

        LessonDetailResponseBuilder builder = LessonDetailResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .orderIndex(lesson.getOrderIndex())
                .isExam(lesson.isExam())
                .activities(activities);

        if (lessonProgress != null) {
            builder.status(lessonProgress.getStatus())
                    .finalized(lessonProgress.isFinalized())
                    .totalScore(lessonProgress.getTotalScore())
                    .bestScore(lessonProgress.getBestScore())
                    .totalXpEarned(lessonProgress.getTotalXpEarned())
                    .totalActivities(lessonProgress.getTotalActivities())
                    .completedActivities(lessonProgress.getCompletedActivities())
                    .attempts(lessonProgress.getAttempts())
                    .lastActivityOrder(lessonProgress.getLastActivityOrder());
        } else {
            builder.status(LessonProgressStatus.LOCKED)
                    .finalized(false)
                    .totalScore(0)
                    .bestScore(0)
                    .totalXpEarned(0)
                    .totalActivities(0)
                    .completedActivities(0)
                    .attempts(0)
                    .lastActivityOrder(0);
        }
        return builder.build();
    }
}