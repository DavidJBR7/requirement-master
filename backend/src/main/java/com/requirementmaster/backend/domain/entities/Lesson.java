package com.requirementmaster.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // "1.1", "1.2", ..., "exam"

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String objective;

    @Column(columnDefinition = "TEXT")
    private String theory;

    private Integer orderNumber;

    @Column(name = "required_xp")
    private Integer requiredXp = 0;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private List<Activity> activities;
}
