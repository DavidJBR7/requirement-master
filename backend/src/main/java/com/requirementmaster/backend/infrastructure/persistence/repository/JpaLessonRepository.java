package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaLessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findAllByOrderByOrderIndexAsc();
}