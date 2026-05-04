package com.requirementmaster.backend.infrastructure.web.controllers;

import com.requirementmaster.backend.application.dto.response.LessonResultResponse;
import com.requirementmaster.backend.application.dto.response.MessageResponse;
import com.requirementmaster.backend.application.service.ProgressService;
import com.requirementmaster.backend.infrastructure.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/lessons/{lessonId}/finalize")
    public ResponseEntity<LessonResultResponse> finalizeLesson(@AuthenticationPrincipal UserPrincipal principal,
                                                               @PathVariable Long lessonId) {
        LessonResultResponse result = progressService.finalizeLesson(lessonId, principal.getId());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/lessons/{lessonId}/reset")
    public ResponseEntity<MessageResponse> resetLesson(@AuthenticationPrincipal UserPrincipal principal,
                                                       @PathVariable Long lessonId) {
        progressService.resetLesson(lessonId, principal.getId());
        return ResponseEntity.ok(new MessageResponse("Lección reiniciada exitosamente"));
    }
}