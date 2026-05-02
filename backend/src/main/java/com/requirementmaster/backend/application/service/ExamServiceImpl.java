package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ExamSubmissionRequest;
import com.requirementmaster.backend.application.dto.response.ExamResultResponse;
import com.requirementmaster.backend.infrastructure.persistence.repository.JpaExamRepository;
import org.springframework.stereotype.Service;

@Service
public class ExamServiceImpl implements ExamService {

    private final JpaExamRepository examRepository;

    public ExamServiceImpl(JpaExamRepository examRepository) {
        this.examRepository = examRepository;
    }

    @Override
    public ExamResultResponse submitExam(ExamSubmissionRequest request) {
        // Placeholder
        return new ExamResultResponse();
    }

    @Override
    public ExamResultResponse getExamResult(Long userId) {
        // Placeholder
        return new ExamResultResponse();
    }
}
