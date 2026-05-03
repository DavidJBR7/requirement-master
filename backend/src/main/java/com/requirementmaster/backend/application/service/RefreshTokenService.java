package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.domain.entities.RefreshToken;
import com.requirementmaster.backend.domain.entities.User;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final JpaRefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshToken createRefreshToken(User user, boolean rememberMe) {
        // Revocamos tokens anteriores del usuario para evitar acumulación
        refreshTokenRepository.deleteAllByUserId(user.getId());

        long expirationDays = rememberMe ? 30 : 1; // 30 días o 24 horas
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(LocalDateTime.now().plusDays(expirationDays))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional(readOnly = true)
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public void revokeToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    @Transactional
    public void revokeAllUserTokens(Long userId) {
        refreshTokenRepository.deleteAllByUserId(userId);
    }

    public boolean isTokenValid(RefreshToken refreshToken) {
        return !refreshToken.isRevoked() && refreshToken.getExpiryDate().isAfter(LocalDateTime.now());
    }
}