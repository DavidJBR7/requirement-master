package com.requirementmaster.backend.infrastructure.web.controllers;

import com.requirementmaster.backend.application.dto.request.ActivityAnswerRequest;
import com.requirementmaster.backend.application.dto.response.ActivityFullResponse;
import com.requirementmaster.backend.application.dto.response.AnswerRecordResponse;
import com.requirementmaster.backend.application.service.ActivityService;
import com.requirementmaster.backend.infrastructure.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping("/{id}")
    public ResponseEntity<ActivityFullResponse> getActivity(@AuthenticationPrincipal UserPrincipal principal,
                                                            @PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivity(id, principal.getId()));
    }

    @PostMapping("/answer")
    public ResponseEntity<List<AnswerRecordResponse>> processAnswer(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @Valid @RequestBody ActivityAnswerRequest request) {
        // El activityId viene en el cuerpo de la petición, el servicio lo extrae directamente
        List<AnswerRecordResponse> responses = activityService.processAnswer(request, principal.getId());
        return ResponseEntity.ok(responses);
    }
}