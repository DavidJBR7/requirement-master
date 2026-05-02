package com.requirementmaster.backend.infrastructure.external;

import org.springframework.stereotype.Component;

@Component
public class PdfReportGenerator {
    public byte[] generateProgressReport(Long userId) {
        // Generar PDF con reporte
        return new byte[0];
    }
}
