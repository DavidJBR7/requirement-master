package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long expiresIn;  // Milisegundos hasta expiración
    private UserSummaryResponse user;

    public AuthResponse(String token, UserSummaryResponse user) {
        this.token = token;
        this.user = user;
    }

    public AuthResponse(String token, String refreshToken, UserSummaryResponse user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}