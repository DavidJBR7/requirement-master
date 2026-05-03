package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.application.dto.response.LessonProgressResponse;
import com.requirementmaster.backend.application.dto.response.LessonResponse;
import com.requirementmaster.backend.domain.entities.Lesson;
import com.requirementmaster.backend.domain.entities.LessonProgress;
import com.requirementmaster.backend.shared.utils.DateUtils;
import org.springframework.stereotype.Component;

@Component
public class LessonMapper {

    public LessonResponse toResponse(Lesson lesson, LessonProgress progress, Integer totalActivitiesCount) {
        LessonResponse.LessonResponseBuilder builder = LessonResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .orderIndex(lesson.getOrderIndex());

        if (progress != null) {
            builder.isCompleted(progress.isCompleted())
                    .progressPercentage(progress.getTotalActivities() > 0 ?
                            (progress.getCompletedActivities() * 100 / progress.getTotalActivities()) : 0)
                    .progress(toProgressResponse(progress));
        }

        return builder.build();
    }

    public LessonProgressResponse toProgressResponse(LessonProgress progress) {
        if (progress == null) return null;

        return LessonProgressResponse.builder()
                .lessonId(progress.getLesson().getId())
                .completed(progress.isCompleted())
                .startedAt(DateUtils.formatColombia(progress.getStartedAt()))
                .completedAt(DateUtils.formatColombia(progress.getCompletedAt()))
                .totalScore(progress.getTotalScore())
                .completedActivities(progress.getCompletedActivities())
                .totalActivities(progress.getTotalActivities())
                .attempts(progress.getAttempts())
                .build();
    }
}