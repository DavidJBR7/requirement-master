package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.domain.entities.Lesson;
import com.requirementmaster.backend.application.dto.response.LessonResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    LessonResponse toResponse(Lesson lesson);
}
