package com.requirementmaster.backend.infrastructure.external;

import org.springframework.stereotype.Component;

@Component
public class ScormGenerator {
    public String generateScormPackage(Long userId) {
        // Lógica para generar SCORM
        return "scorm_package_path";
    }
}
