package com.requirementmaster.backend.infrastructure.web.controllers;

import com.requirementmaster.backend.application.dto.request.ChangePasswordRequest;
import com.requirementmaster.backend.application.dto.request.UpdateProfileRequest;
import com.requirementmaster.backend.application.dto.response.MessageResponse;
import com.requirementmaster.backend.application.dto.response.UserProfileResponse;
import com.requirementmaster.backend.application.service.AuthService;
import com.requirementmaster.backend.infrastructure.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(authService.getUserProfile(principal.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(authService.updateProfile(principal.getId(), request));
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(new MessageResponse("Contraseña actualizada exitosamente"));
    }
}