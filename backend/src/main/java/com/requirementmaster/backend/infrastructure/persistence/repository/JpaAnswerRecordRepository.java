package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.AnswerRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaAnswerRecordRepository extends JpaRepository<AnswerRecord, Long> {
    List<AnswerRecord> findByActivityProgressId(Long activityProgressId);

    @Query("SELECT ar FROM AnswerRecord ar JOIN FETCH ar.activityProgress ap JOIN FETCH ap.activity WHERE ap.user.id = :userId")

    List<AnswerRecord> findAllByUserIdWithRelations(@Param("userId") Long userId);
}