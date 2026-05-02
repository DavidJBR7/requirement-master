package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.response.LessonResponse;
import com.requirementmaster.backend.application.mappers.LessonMapper;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaLessonRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonServiceImpl implements LessonService {

    private final JpaLessonRepository lessonRepository;
    private final LessonMapper lessonMapper;

    public LessonServiceImpl(JpaLessonRepository lessonRepository, LessonMapper lessonMapper) {
        this.lessonRepository = lessonRepository;
        this.lessonMapper = lessonMapper;
    }

    @Override
    public List<LessonResponse> getAllLessons() {
        return lessonRepository.findAllByOrderByOrderNumberAsc()
            .stream()
            .map(lessonMapper::toResponse)
            .collect(Collectors.toList());
    }

    @Override
    public LessonResponse getLessonById(Long id) {
        return lessonRepository.findById(id)
            .map(lessonMapper::toResponse)
            .orElseThrow(() -> new RuntimeException("Lesson not found"));
    }
}
