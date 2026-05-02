package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.domain.entities.User;
import com.requirementmaster.backend.application.dto.response.AuthResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    AuthResponse toAuthResponse(User user, String token);
}
