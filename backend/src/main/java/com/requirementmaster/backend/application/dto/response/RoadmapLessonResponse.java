package com.requirementmaster.backend.application.dto.response;

import com.requirementmaster.backend.domain.entities.Lesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapLessonResponse {

    private Long id;
    private String title;
    private int orderIndex;
    private boolean isExam;
    private LessonStatus status;
    private Integer currentProgressPercent;  // solo IN_PROGRESS
    private Integer bestScore;
    private Integer totalXp;

    public enum LessonStatus {
        LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    }

    public static RoadmapLessonResponse of(Lesson lesson,
                                           LessonStatus status,
                                           Integer currentProgressPercent,
                                           Integer bestScore,
                                           Integer totalXp) {
        RoadmapLessonResponse response = new RoadmapLessonResponse();
        response.setId(lesson.getId());
        response.setTitle(lesson.getTitle());
        response.setOrderIndex(lesson.getOrderIndex());
        response.setExam(lesson.isExam());
        response.setStatus(status);

        if (status == LessonStatus.IN_PROGRESS) {
            response.setCurrentProgressPercent(currentProgressPercent);
        } else if (status == LessonStatus.COMPLETED) {
            response.setBestScore(bestScore);
            response.setTotalXp(totalXp);
        }
        return response;
    }
}