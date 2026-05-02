package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.domain.entities.Activity;
import com.requirementmaster.backend.application.dto.response.ActivityResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
    ActivityResponse toResponse(Activity activity, boolean correct, int score, int xp);
}
