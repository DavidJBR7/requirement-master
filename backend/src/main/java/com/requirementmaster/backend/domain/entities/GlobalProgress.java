package com.requirementmaster.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "global_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private int xpTotal = 0;

    @Column(nullable = false)
    @Builder.Default
    private int lessonsCompleted = 0;

    @Column(nullable = false)
    @Builder.Default
    private int totalLessons = 0;

    @Column(nullable = false)
    @Builder.Default
    private int activitiesCompleted = 0;

    @Column(nullable = false)
    @Builder.Default
    private int totalActivities = 0;

    @Column(nullable = false)
    @Builder.Default
    private double averageScore = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private int currentStreak = 0;

    @Column(nullable = false)
    @Builder.Default
    private int longestStreak = 0;

    @Column(name = "last_activity_date")
    private LocalDateTime lastActivityDate;
}