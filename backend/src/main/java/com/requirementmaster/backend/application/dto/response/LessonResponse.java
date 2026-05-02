package com.requirementmaster.backend.application.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class LessonResponse {
    private Long id;
    private String code;
    private String title;
    private String objective;
    private String theory;
    private Integer orderNumber;
    private Integer requiredXp;
    private List<ActivityResponse> activities;
}
