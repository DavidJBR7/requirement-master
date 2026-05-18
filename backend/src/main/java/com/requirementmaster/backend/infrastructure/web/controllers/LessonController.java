        package com.requirementmaster.backend.infrastructure.web.controllers;

        import com.requirementmaster.backend.application.dto.response.LessonDetailResponse;
        import com.requirementmaster.backend.application.dto.response.RoadmapLessonResponse;
        import com.requirementmaster.backend.application.service.LessonService;
        import com.requirementmaster.backend.infrastructure.security.UserPrincipal;
        import lombok.RequiredArgsConstructor;
        import org.springframework.http.ResponseEntity;
        import org.springframework.security.core.annotation.AuthenticationPrincipal;
        import org.springframework.web.bind.annotation.*;

        import java.util.List;

        @RestController
        @RequestMapping("/api/lessons")
        @RequiredArgsConstructor
        public class LessonController {

            private final LessonService lessonService;

            @GetMapping("/roadmap")
            public ResponseEntity<List<RoadmapLessonResponse>> getRoadmap(@AuthenticationPrincipal UserPrincipal principal) {
                return ResponseEntity.ok(lessonService.getRoadmap(principal.getId()));
            }

            @GetMapping("/{id}")
            public ResponseEntity<LessonDetailResponse> getLessonDetail(@AuthenticationPrincipal UserPrincipal principal,
                                                                        @PathVariable Long id) {
                return ResponseEntity.ok(lessonService.getLessonDetail(id, principal.getId()));
            }
        }