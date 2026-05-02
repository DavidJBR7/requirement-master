package com.requirementmaster.backend.shared.utils;

import java.util.regex.Pattern;

public final class ValidationUtils {
    private ValidationUtils() {
        throw new IllegalStateException("Clase de utilidades, no instanciable");
    }

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private static final Pattern USERNAME_PATTERN =
            Pattern.compile("^[a-zA-Z0-9._-]{3,20}$");

    // Mínimo 8 caracteres, al menos una letra y un número
    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$");

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidUsername(String username) {
        return username != null && USERNAME_PATTERN.matcher(username).matches();
    }

    public static boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }

    public static String sanitize(String input) {
        if (input == null) return null;
        return input.trim().replaceAll("[<>\"'%;()&+]", "");
    }
}