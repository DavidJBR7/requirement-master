package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.LessonProgress;
import com.requirementmaster.backend.domain.enums.LessonProgressStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface JpaLessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<LessonProgress> findByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, LessonProgressStatus status);

    @Query("SELECT lp FROM LessonProgress lp JOIN FETCH lp.lesson WHERE lp.user.id = :userId")
    List<LessonProgress> findAllByUserIdWithLesson(@Param("userId") Long userId);

    @Query("SELECT lp FROM LessonProgress lp JOIN FETCH lp.lesson WHERE lp.user.id = :userId AND lp.finalized = false AND lp.status = :status")
    List<LessonProgress> findUnfinalizedInProgress(@Param("userId") Long userId, @Param("status") LessonProgressStatus status);
}