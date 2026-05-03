package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByLessonIdOrderByOrderIndexAsc(Long lessonId);
}