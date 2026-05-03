package com.requirementmaster.backend.domain.entities;

import com.requirementmaster.backend.domain.enums.ActivityType;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.Map;

@Entity
@Table(name = "activities")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ActivityType type;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    // Puntos máximos que esta actividad aporta a la nota de la lección (0-100 acumulable)
    @Column(nullable = false)
    @Builder.Default
    private int maxScore = 100;

    // XP máximo que se puede obtener en esta actividad (suma de XP de todas las respuestas correctas)
    @Column(nullable = false)
    @Builder.Default
    private int maxXp = 10;

    // Configuración específica en JSON: preguntas, opciones, XP por ítem, etc.
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> configuration;
}