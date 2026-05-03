package com.requirementmaster.backend.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportExportResponse {
    private String reportUrl;
    private String fileName;
    private Long fileSize;
    private String generatedAt;
    private String expiresAt;  // Para URLs temporales
}