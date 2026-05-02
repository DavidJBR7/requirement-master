//package com.requirementmaster.backend.domain.entities;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import io.hypersistence.utils.hibernate.type.json.JsonType;
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.Type;
//
//@Entity
//@Table(name = "exams")
//@Getter
//@Setter
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class Exam {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String title;
//
//    @Type(JsonType.class)
//    @Column(columnDefinition = "jsonb")
//    private JsonNode questions;   // Lista de preguntas con opciones
//
//    private Integer passingScore;
//}
