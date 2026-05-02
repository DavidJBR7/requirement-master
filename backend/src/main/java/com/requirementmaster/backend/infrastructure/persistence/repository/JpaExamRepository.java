package com.requirementmaster.backend.infrastructure.persistence.repository;

import com.requirementmaster.backend.domain.entities.Exam;
import com.requirementmaster.backend.domain.entities.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JpaExamRepository extends JpaRepository<Exam, Long> {
}

interface JpaExamResultRepository extends JpaRepository<ExamResult, Long> {
    Optional<ExamResult> findByUserIdAndExamId(Long userId, Long examId);
}
