package com.requirementmaster.backend.shared.utils;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtils {
    private DateUtils() {
        throw new IllegalStateException("Clase de utilidades, no instanciable");
    }

    // Formato típico de Colombia: día/mes/año hora:minuto:segundos
    public static final DateTimeFormatter COLOMBIA_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    // ISO para BD o APIs
    public static final DateTimeFormatter ISO_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Método para formato Colombia
    public static String formatColombia(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(COLOMBIA_FORMATTER) : null;
    }

    // Método legacy para no romper código existente (usando ISO)
    public static String format(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(ISO_FORMATTER) : null;
    }

    public static long secondsBetween(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) return 0;
        return Duration.between(start, end).getSeconds();
    }

    public static boolean isSameDay(LocalDateTime d1, LocalDateTime d2) {
        if (d1 == null || d2 == null) return false;
        return d1.toLocalDate().isEqual(d2.toLocalDate());
    }

    public static long daysBetween(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) return 0;
        return Duration.between(start.toLocalDate().atStartOfDay(), end.toLocalDate().atStartOfDay()).toDays();
    }
}