package com.requirementmaster.backend.domain.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " no encontrado con id: " + id);
    }

    public ResourceNotFoundException(String resource, String identifier) {
        super(resource + " no encontrado con identificador: " + identifier);
    }
}