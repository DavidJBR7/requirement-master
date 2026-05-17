package com.requirementmaster.backend.infrastructure.web.advice;

import com.requirementmaster.backend.application.dto.response.ErrorResponse;
import com.requirementmaster.backend.domain.exceptions.BusinessException;
import com.requirementmaster.backend.domain.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(404)
                .error("Recurso no encontrado")
                .message(ex.getMessage())
                .timestamp(Instant.now().toEpochMilli())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(400)
                .error("Error de negocio")
                .message(ex.getMessage())
                .timestamp(Instant.now().toEpochMilli())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining("; "));
        ErrorResponse error = ErrorResponse.builder()
                .status(400)
                .error("Error de validación")
                .message(message)
                .timestamp(Instant.now().toEpochMilli())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorResponse error = ErrorResponse.builder()
                .status(500)
                .error("Error interno")
                .message(ex.getMessage())
                .timestamp(Instant.now().toEpochMilli())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}