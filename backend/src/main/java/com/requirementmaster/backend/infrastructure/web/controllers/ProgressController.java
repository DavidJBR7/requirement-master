//package com.requirementmaster.backend.web.controllers;
//
//import com.requirementmaster.backend.application.dto.response.DashboardResponse;
//import com.requirementmaster.backend.application.dto.response.ProgressResponse;
//import com.requirementmaster.backend.application.service.ProgressService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/progress")
//public class ProgressController {
//
//    private final ProgressService progressService;
//
//    public ProgressController(ProgressService progressService) {
//        this.progressService = progressService;
//    }
//
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<ProgressResponse> getUserProgress(@PathVariable Long userId) {
//        return ResponseEntity.ok(progressService.getUserProgress(userId));
//    }
//
//    @GetMapping("/dashboard/{userId}")
//    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable Long userId) {
//        return ResponseEntity.ok(progressService.getDashboard(userId));
//    }
//}
