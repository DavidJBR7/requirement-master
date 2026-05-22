package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.ActivityProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface JpaActivityProgressRepository extends JpaRepository<ActivityProgress, Long> {

    // Usado para la sesión actual (solo activos)
    Optional<ActivityProgress> findByUserIdAndActivityIdAndActiveTrue(Long userId, Long activityId);

    // Histórico (todos, sin filtrar por active) – se mantiene para dashboard
    Optional<ActivityProgress> findByUserIdAndActivityId(Long userId, Long activityId);

    // Sesión actual en una lección (solo activos)
    List<ActivityProgress> findByUserIdAndActivity_LessonIdAndActiveTrue(Long userId, Long lessonId);

    // Histórico en una lección (todos) – mantenemos el original por si se necesita
    List<ActivityProgress> findByUserIdAndActivity_LessonId(Long userId, Long lessonId);

    @Query("SELECT ap FROM ActivityProgress ap JOIN FETCH ap.activity WHERE ap.user.id = :userId")
    List<ActivityProgress> findAllByUserIdWithActivity(@Param("userId") Long userId);
}