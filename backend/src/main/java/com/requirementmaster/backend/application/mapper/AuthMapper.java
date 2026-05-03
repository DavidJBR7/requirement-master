package com.requirementmaster.backend.application.mapper;

import com.requirementmaster.backend.application.dto.response.AuthResponse;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public AuthResponse toAuthResponse(String accessToken, String refreshToken, long accessExpiresIn) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessExpiresIn)
                .build();
    }
}