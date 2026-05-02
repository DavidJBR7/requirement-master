package com.requirementmaster.backend.domain.entities;

import com.fasterxml.jackson.databind.JsonNode;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "activities")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private ActivityType type;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private JsonNode config;          // Configuración específica de la actividad (preguntas, opciones, etc.)

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private JsonNode expectedAnswer;   // Respuesta esperada (formato variable)

    private Integer maxScore;
    private Integer xpReward;
}
