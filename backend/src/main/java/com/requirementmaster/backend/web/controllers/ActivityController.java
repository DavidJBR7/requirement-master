//package com.requirementmaster.backend.web.controllers;
//
//import com.requirementmaster.backend.application.dto.request.ActivityAnswerRequest;
//import com.requirementmaster.backend.application.dto.response.ActivityResponse;
//import com.requirementmaster.backend.application.service.ActivityService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/activities")
//public class ActivityController {
//
//    private final ActivityService activityService;
//
//    public ActivityController(ActivityService activityService) {
//        this.activityService = activityService;
//    }
//
//    @PostMapping("/{id}/validate")
//    public ResponseEntity<ActivityResponse> validate(@PathVariable Long id,
//                                                     @RequestBody ActivityAnswerRequest request) {
//        return ResponseEntity.ok(activityService.validateAnswer(id, request));
//    }
//}
