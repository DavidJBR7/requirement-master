package com.requirementmaster.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    @Builder.Default
    private int totalScore = 0;

    @Column(nullable = false)
    @Builder.Default
    private int totalActivities = 0;

    @Column(nullable = false)
    @Builder.Default
    private int completedActivities = 0;

    @Column(nullable = false)
    @Builder.Default
    private int attempts = 0;

    @Builder.Default
    private int lastActivityOrder = 0;
}