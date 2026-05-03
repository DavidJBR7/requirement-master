package com.requirementmaster.backend.application.mappers;

import com.requirementmaster.backend.application.dto.request.RegisterRequest;
import com.requirementmaster.backend.application.dto.response.UserResponse;
import com.requirementmaster.backend.application.dto.response.UserSummaryResponse;
import com.requirementmaster.backend.domain.entities.User;
import com.requirementmaster.backend.shared.utils.DateUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private final BCryptPasswordEncoder passwordEncoder;

    public UserMapper() {
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User toEntity(RegisterRequest request) {
        return User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .username(request.getUsername())
                .enabled(true)
                .credentialsNonExpired(true)
                .build();
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .enabled(user.isEnabled())
                .build();
    }

    public UserSummaryResponse toSummary(User user, int level, int currentXp, int xpToNextLevel) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .level(level)
                .currentXp(currentXp)
                .xpToNextLevel(xpToNextLevel)
                .build();
    }

    public void updateEntity(User user, String newFullName, String newUsername) {
        if (newFullName != null && !newFullName.isBlank()) {
            user.setFullName(newFullName);
        }
        if (newUsername != null && !newUsername.isBlank()) {
            user.setUsername(newUsername);
        }
    }
}