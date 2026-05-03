package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.AnswerRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaAnswerRecordRepository extends JpaRepository<AnswerRecord, Long> {
    List<AnswerRecord> findByActivityProgressId(Long activityProgressId);
}