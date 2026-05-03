package com.requirementmaster.backend.application.mapper;

import com.requirementmaster.backend.application.dto.response.ErrorResponse;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class ErrorMapper {

    public ErrorResponse toErrorResponse(int status, String error, String message) {
        return ErrorResponse.builder()
                .status(status)
                .error(error)
                .message(message)
                .timestamp(Instant.now().toEpochMilli())
                .build();
    }
}