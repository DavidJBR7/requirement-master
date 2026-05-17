package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.entities.ActivityProgress;
import com.requirementmaster.backend.domain.entities.Lesson;
import com.requirementmaster.backend.domain.entities.LessonProgress;
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
    private LessonProgressResponse progress;

    /**
     * Construye la vista detallada de una lección.
     */
    public static LessonDetailResponse of(Lesson lesson,
                                          Map<Long, ActivityProgress> activityProgressMap,
                                          LessonProgress lessonProgress) {
        if (lesson == null) return null;

        List<ActivityFullResponse> activities = lesson.getActivities() != null
                ? lesson.getActivities().stream()
                  .map(act -> {
                      ActivityProgress ap = activityProgressMap != null
                              ? activityProgressMap.get(act.getId()) : null;
                      return ActivityFullResponse.summary(act, ap);
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
                .progress(LessonProgressResponse.from(lessonProgress))
                .build();
    }
}