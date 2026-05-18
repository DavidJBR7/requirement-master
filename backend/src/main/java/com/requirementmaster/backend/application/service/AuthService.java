package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.*;
import com.requirementmaster.backend.application.dto.response.AuthResponse;
import com.requirementmaster.backend.application.dto.response.MessageResponse;
import com.requirementmaster.backend.domain.entities.*;
import com.requirementmaster.backend.domain.exceptions.BusinessException;
import com.requirementmaster.backend.infrastructure.persistence.repository.*;
import com.requirementmaster.backend.infrastructure.security.JwtTokenProvider;
import com.requirementmaster.backend.shared.constants.ErrorConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final JpaUserRepository userRepository;
    private final JpaRefreshTokenRepository refreshTokenRepository;
    private final JpaPasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorConstants.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(ErrorConstants.USERNAME_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .username(request.getUsername().trim())
                .build();
        userRepository.save(user);

        return new MessageResponse("Usuario registrado exitosamente. Por favor inicia sesión.");
    }

    public AuthResponse login(LoginRequest request) {
        String login = request.getLogin().trim().toLowerCase();
        boolean rememberMe = request.isRememberMe();
        Optional<User> userOpt = userRepository.findByEmail(login);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(login);
        }
        User user = userOpt.orElseThrow(() -> new BusinessException(ErrorConstants.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorConstants.INVALID_CREDENTIALS);
        }
        if (!user.isEnabled()) {
            throw new BusinessException(ErrorConstants.ACCOUNT_DISABLED);
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getUsername());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user, rememberMe);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .refreshToken(refreshToken.getToken())
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000)
                .build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        Optional<RefreshToken> storedTokenOpt = refreshTokenService.findByToken(token);
        RefreshToken storedToken = storedTokenOpt.orElseThrow(
                () -> new BusinessException("Refresh token inválido"));

        if (!refreshTokenService.isTokenValid(storedToken)) {
            throw new BusinessException("Refresh token expirado o revocado");
        }

        User user = storedToken.getUser();
        if (!user.isEnabled()) {
            throw new BusinessException(ErrorConstants.ACCOUNT_DISABLED);
        }

        refreshTokenService.revokeToken(token);
        boolean rememberMe = storedToken.getExpiryDate()
                .isAfter(LocalDateTime.now().plusDays(25));
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getUsername());
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user, rememberMe);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .refreshToken(newRefreshToken.getToken())
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000)
                .build();
    }

    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("No existe un usuario con ese correo"));

        List<PasswordResetToken> existingTokens = passwordResetTokenRepository.findAllByEmailAndUsedFalse(email);
        for (PasswordResetToken t : existingTokens) {
            t.setUsed(true);
            passwordResetTokenRepository.save(t);
        }

        Random random = new SecureRandom();
        String code = String.format("%06d", random.nextInt(1_000_000));

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(code)
                .email(email)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();
        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetCode(email, code);
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BusinessException("Las contraseñas no coinciden");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenAndUsedFalse(request.getToken())
                .orElseThrow(() -> new BusinessException(ErrorConstants.INVALID_RESET_TOKEN));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ErrorConstants.INVALID_RESET_TOKEN);
        }

        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        refreshTokenService.revokeAllUserTokens(user.getId());
    }
}