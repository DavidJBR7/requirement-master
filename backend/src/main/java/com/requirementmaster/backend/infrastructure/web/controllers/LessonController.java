//package com.requirementmaster.backend.web.controllers;
//
//import com.requirementmaster.backend.application.dto.response.LessonResponse;
//import com.requirementmaster.backend.application.service.LessonService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/lessons")
//public class LessonController {
//
//    private final LessonService lessonService;
//
//    public LessonController(LessonService lessonService) {
//        this.lessonService = lessonService;
//    }
//
//    @GetMapping
//    public ResponseEntity<List<LessonResponse>> getAllLessons() {
//        return ResponseEntity.ok(lessonService.getAllLessons());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<LessonResponse> getLessonById(@PathVariable Long id) {
//        return ResponseEntity.ok(lessonService.getLessonById(id));
//    }
//}
