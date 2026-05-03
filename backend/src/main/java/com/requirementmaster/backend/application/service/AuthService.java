package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.*;
import com.requirementmaster.backend.application.dto.response.AuthResponse;
import com.requirementmaster.backend.application.dto.response.MessageResponse;
import com.requirementmaster.backend.application.mapper.AuthMapper;
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
    private final JpaGlobalProgressRepository globalProgressRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;
    private final AuthMapper authMapper;

    public MessageResponse register(RegisterRequest request) {
        // Validar unicidad
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorConstants.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(ErrorConstants.USERNAME_ALREADY_EXISTS);
        }

        // Crear usuario
        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .username(request.getUsername().trim())
                .build();
        user = userRepository.save(user);

        // Crear progreso global inicial
        GlobalProgress globalProgress = GlobalProgress.builder()
                .user(user)
                .xpTotal(0)
                .lessonsCompleted(0)
                .examPassed(false)
                .build();
        globalProgressRepository.save(globalProgress);

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

        // Generar tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getUsername());

        // Almacenar refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user, rememberMe);

        return authMapper.toAuthResponse(
                accessToken,
                refreshToken.getToken(),
                jwtTokenProvider.getAccessTokenExpiration() / 1000
        );
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        Optional<RefreshToken> storedTokenOpt = refreshTokenService.findByToken(token);
        RefreshToken storedToken = storedTokenOpt.orElseThrow(
                () -> new BusinessException("Refresh token inválido")
        );

        if (!refreshTokenService.isTokenValid(storedToken)) {
            throw new BusinessException("Refresh token expirado o revocado");
        }

        User user = storedToken.getUser();
        if (!user.isEnabled()) {
            throw new BusinessException(ErrorConstants.ACCOUNT_DISABLED);
        }

        // Revocar el token usado para evitar reuso (rotación)
        refreshTokenService.revokeToken(token);

        // Generar nuevo par de tokens (usamos rememberMe basado en la expiración original)
        boolean rememberMe = storedToken.getExpiryDate()
                .isAfter(LocalDateTime.now().plusDays(25)); // si quedan muchos días, era "remember me"
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getUsername());
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user, rememberMe);

        return authMapper.toAuthResponse(
                newAccessToken,
                newRefreshToken.getToken(),
                jwtTokenProvider.getAccessTokenExpiration() / 1000
        );
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

        // Invalidar tokens de reseteo previos
        List<PasswordResetToken> existingTokens = passwordResetTokenRepository.findAllByEmailAndUsedFalse(email);
        for (PasswordResetToken t : existingTokens) {
            t.setUsed(true);
            passwordResetTokenRepository.save(t);
        }

        // Generar código de 6 dígitos
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

        // Marcar token como usado
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Invalidar todas las sesiones (tokens de refresco)
        refreshTokenService.revokeAllUserTokens(user.getId());
    }
}