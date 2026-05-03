package com.requirementmaster.backend.shared.constants;

public final class ApiConstants {
    private ApiConstants() {
        throw new IllegalStateException("Clase de constantes, no instanciable");
    }

    public static final String API_BASE = "/api";
    public static final String AUTH_PATH = API_BASE + "/auth";
    public static final String LESSONS_PATH = API_BASE + "/lessons";
    public static final String ACTIVITIES_PATH = API_BASE + "/activities";
    public static final String PROGRESS_PATH = API_BASE + "/progress";
    public static final String REPORTS_PATH = API_BASE + "/reports";

    // Auth endpoints
    public static final String LOGIN = "/login";
    public static final String REGISTER = "/register";
    public static final String FORGOT_PASSWORD = "/forgot-password";
    public static final String RESET_PASSWORD = "/reset-password";
    public static final String REFRESH_TOKEN = "/refresh-token";

    // Common path variables
    public static final String ID_PATH = "/{id}";
    public static final String USER_ID_PATH = "/user/{userId}";

    // Pagination defaults
    public static final String DEFAULT_PAGE = "0";
    public static final String DEFAULT_SIZE = "20";
    public static final String MAX_SIZE = "100";
}