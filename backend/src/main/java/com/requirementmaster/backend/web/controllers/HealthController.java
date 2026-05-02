//package com.requirementmaster.backend.web.controllers;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/health")
//public class HealthController {
//
//    @GetMapping
//    public ResponseEntity<Map<String, String>> health() {
//        Map<String, String> status = new HashMap<>();
//        status.put("status", "UP");
//        status.put("service", "Requirement Master Backend");
//        return ResponseEntity.ok(status);
//    }
//}
