package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ChangeEmailRequest;
import com.requirementmaster.backend.application.dto.request.ChangePasswordRequest;
import com.requirementmaster.backend.application.dto.request.UpdateProfileRequest;
import com.requirementmaster.backend.application.dto.response.UserProfileResponse;
import com.requirementmaster.backend.application.mapper.UserMapper;
import com.requirementmaster.backend.domain.entities.GlobalProgress;
import com.requirementmaster.backend.domain.entities.User;
import com.requirementmaster.backend.domain.exceptions.BusinessException;
import com.requirementmaster.backend.domain.exceptions.ResourceNotFoundException;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaGlobalProgressRepository;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaUserRepository;
import com.requirementmaster.backend.shared.constants.ErrorConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final JpaUserRepository userRepository;
    private final JpaGlobalProgressRepository globalProgressRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        GlobalProgress gp = globalProgressRepository.findByUserId(userId).orElse(null);
        return userMapper.toProfileResponse(user, gp);
    }

    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            String newUsername = request.getUsername().trim();
            if (!newUsername.equals(user.getUsername()) &&
                    userRepository.existsByUsername(newUsername)) {
                throw new BusinessException(ErrorConstants.USERNAME_ALREADY_EXISTS);
            }
            user.setUsername(newUsername);
        }

        user = userRepository.save(user);
        GlobalProgress gp = globalProgressRepository.findByUserId(userId).orElse(null);
        return userMapper.toProfileResponse(user, gp);
    }

    public void changeEmail(Long userId, ChangeEmailRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        String newEmail = request.getNewEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(newEmail)) {
            throw new BusinessException(ErrorConstants.EMAIL_ALREADY_EXISTS);
        }
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("La contraseña actual es incorrecta");
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BusinessException("Las contraseñas no coinciden");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Invalidar todas las sesiones del usuario
        refreshTokenService.revokeAllUserTokens(userId);
    }
}