package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.LessonResponse;
import java.util.List;

public interface LessonService {
    List<LessonResponse> getAllLessons();
    LessonResponse getLessonById(Long id);
}
