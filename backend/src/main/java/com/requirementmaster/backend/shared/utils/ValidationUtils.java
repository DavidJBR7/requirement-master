package com.requirementmaster.backend.shared.utils;

public final class ValidationUtils {
    private ValidationUtils() {}
    public static boolean isValidEmail(String email) {
        return email != null && email.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }
}
