package com.requirementmaster.backend.shared.constants;

public final class ErrorConstants {
    private ErrorConstants() {
        throw new IllegalStateException("Clase de constantes, no instanciable");
    }

    public static final String RESOURCE_NOT_FOUND = "Recurso no encontrado";
    public static final String VALIDATION_ERROR = "Error de validación";
    public static final String UNAUTHORIZED = "No autorizado";
    public static final String FORBIDDEN = "Acceso denegado";
    public static final String INTERNAL_ERROR = "Error interno del servidor";

    // Auth
    public static final String INVALID_CREDENTIALS = "Credenciales inválidas";
    public static final String EMAIL_ALREADY_EXISTS = "El email ya está registrado";
    public static final String USERNAME_ALREADY_EXISTS = "El nombre de usuario ya está en uso";
    public static final String WEAK_PASSWORD = "La contraseña no cumple los requisitos de seguridad";
    public static final String ACCOUNT_DISABLED = "La cuenta está deshabilitada";
    public static final String INVALID_RESET_TOKEN = "Código de recuperación inválido o expirado";
    public static final String USER_NOT_FOUND = "Usuario no encontrado";

    // Activities
    public static final String INVALID_ANSWER_FORMAT = "El formato de la respuesta no es válido";
    public static final String LESSON_NOT_STARTED = "La lección no ha sido iniciada";

    // Progress
    public static final String PROGRESS_NOT_FOUND = "No se encontró progreso";
}