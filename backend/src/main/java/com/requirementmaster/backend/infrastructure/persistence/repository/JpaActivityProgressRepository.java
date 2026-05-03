package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.ActivityProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface JpaActivityProgressRepository extends JpaRepository<ActivityProgress, Long> {

    Optional<ActivityProgress> findByUserIdAndActivityId(Long userId, Long activityId);

    List<ActivityProgress> findByUserIdAndActivity_LessonId(Long userId, Long lessonId);
}