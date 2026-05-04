package com.requirementmaster.backend.infrastructure.web.controllers;

import com.requirementmaster.backend.application.dto.request.ChangeEmailRequest;
import com.requirementmaster.backend.application.dto.request.ChangePasswordRequest;
import com.requirementmaster.backend.application.dto.request.UpdateProfileRequest;
import com.requirementmaster.backend.application.dto.response.MessageResponse;
import com.requirementmaster.backend.application.dto.response.UserProfileResponse;
import com.requirementmaster.backend.application.service.UserService;
import com.requirementmaster.backend.infrastructure.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                             @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(principal.getId(), request));
    }

    @PutMapping("/email")
    public ResponseEntity<MessageResponse> changeEmail(@AuthenticationPrincipal UserPrincipal principal,
                                                       @Valid @RequestBody ChangeEmailRequest request) {
        userService.changeEmail(principal.getId(), request);
        return ResponseEntity.ok(new MessageResponse("Correo electrónico actualizado exitosamente"));
    }

    @PutMapping("/password")
    public ResponseEntity<MessageResponse> changePassword(@AuthenticationPrincipal UserPrincipal principal,
                                                          @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(new MessageResponse("Contraseña actualizada exitosamente"));
    }
}