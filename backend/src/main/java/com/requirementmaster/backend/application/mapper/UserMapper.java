package com.requirementmaster.backend.application.mapper;

import com.requirementmaster.backend.application.dto.response.UserProfileResponse;
import com.requirementmaster.backend.domain.entities.GlobalProgress;
import com.requirementmaster.backend.domain.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserProfileResponse toProfileResponse(User user, GlobalProgress globalProgress) {
        if (user == null) return null;

        return UserProfileResponse.builder()
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .xpTotal(globalProgress != null ? globalProgress.getXpTotal() : 0)
                .lessonsCompleted(globalProgress != null ? globalProgress.getLessonsCompleted() : 0)
                .examPassed(globalProgress != null && globalProgress.isExamPassed())
                .build();
    }
}