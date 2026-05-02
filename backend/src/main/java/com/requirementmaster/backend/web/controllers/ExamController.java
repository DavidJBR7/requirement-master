package com.requirementmaster.backend.web.controllers;

import com.requirementmaster.backend.application.dto.request.ExamSubmissionRequest;
import com.requirementmaster.backend.application.dto.response.ExamResultResponse;
import com.requirementmaster.backend.application.service.ExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping("/submit")
    public ResponseEntity<ExamResultResponse> submit(@RequestBody ExamSubmissionRequest request) {
        return ResponseEntity.ok(examService.submitExam(request));
    }

    @GetMapping("/result/{userId}")
    public ResponseEntity<ExamResultResponse> getResult(@PathVariable Long userId) {
        return ResponseEntity.ok(examService.getExamResult(userId));
    }
}
