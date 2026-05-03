package com.requirementmaster.backend.domain.enums;

public enum ActivityType {
    TRUE_FALSE,
    MULTIPLE_CHOICE,
    MATCH_PAIRS,
    DRAG_DROP_COLUMNS,      // Arrastre a columnas (clasificación)
    SORTABLE_LIST,          // Ordenar lista (arrastre vertical)
    SWIPE_CARDS,            // Tarjetas deslizables (tipo Tinder)
    CHATBOT_SIMULATION,     // Entrevista simulada
    VENN_DIAGRAM,           // Diagrama de Venn con arrastre
    USER_STORY_BUILDER,     // Constructor de user story
    REWRITE_REQUIREMENT     // Reescribir requisito con subrayado
}