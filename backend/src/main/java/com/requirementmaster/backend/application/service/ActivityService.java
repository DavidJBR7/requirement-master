package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ActivityAnswerRequest;
import com.requirementmaster.backend.application.dto.response.ActivityFullResponse;
import com.requirementmaster.backend.application.dto.response.AnswerRecordResponse;
import com.requirementmaster.backend.application.mapper.ActivityMapper;
import com.requirementmaster.backend.application.mapper.ProgressMapper;
import com.requirementmaster.backend.domain.entities.*;
import com.requirementmaster.backend.domain.enums.ActivityType;
import com.requirementmaster.backend.domain.exceptions.BusinessException;
import com.requirementmaster.backend.domain.exceptions.ResourceNotFoundException;
import com.requirementmaster.backend.infrastructure.persistence.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final JpaActivityRepository activityRepository;
    private final JpaActivityProgressRepository activityProgressRepository;
    private final JpaLessonProgressRepository lessonProgressRepository;
    private final JpaAnswerRecordRepository answerRecordRepository;
    private final JpaGlobalProgressRepository globalProgressRepository;
    private final ActivityMapper activityMapper;
    private final ProgressMapper progressMapper;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public ActivityFullResponse getActivity(Long activityId, Long userId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", activityId));
        ActivityProgress progress = activityProgressRepository
                .findByUserIdAndActivityId(userId, activityId)
                .orElse(null);
        return activityMapper.toFullResponse(activity, progress);
    }

    @Transactional
    public List<AnswerRecordResponse> processAnswer(ActivityAnswerRequest request, Long userId) {
        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity", request.getActivityId()));

        Lesson lesson = activity.getLesson();
        // Obtener o crear progreso de lección
        LessonProgress lessonProgress = lessonProgressRepository
                .findByUserIdAndLessonId(userId, lesson.getId())
                .orElse(null);

        if (lessonProgress != null && lessonProgress.isFinalized()) {
            throw new BusinessException("Esta lección ya fue finalizada. Reiníciala para volver a intentarlo.");
        }

        if (lessonProgress == null) {
            lessonProgress = LessonProgress.builder()
                    .user(getUserReference(userId))
                    .lesson(lesson)
                    .startedAt(LocalDateTime.now())
                    .totalActivities(lesson.getActivities().size())
                    .build();
            lessonProgress = lessonProgressRepository.save(lessonProgress);
        }

        // Obtener o crear progreso de actividad
        ActivityProgress activityProgress = activityProgressRepository
                .findByUserIdAndActivityId(userId, activity.getId())
                .orElse(null);
        if (activityProgress == null) {
            activityProgress = ActivityProgress.builder()
                    .user(getUserReference(userId))
                    .activity(activity)
                    .build();
            activityProgress = activityProgressRepository.save(activityProgress);
        }

        // Validar que la pregunta no haya sido respondida aún
        if (activityProgress.getAnswers().stream()
                .anyMatch(ar -> ar.getQuestionId().equals(request.getQuestionId()))) {
            throw new BusinessException("Esta pregunta ya fue respondida en este intento.");
        }

        List<AnswerRecord> records = evaluateAnswer(activity, request.getQuestionId(), request.getUserAnswer(), activityProgress);

        // Sumar puntos a la actividad
        for (AnswerRecord record : records) {
            activityProgress.setScore(activityProgress.getScore() + record.getPointsAwarded());
            activityProgress.setXpEarned(activityProgress.getXpEarned() + record.getXpAwarded());
            activityProgress.getAnswers().add(record);
            answerRecordRepository.save(record);
        }

        activityProgress.setAttempts(activityProgress.getAttempts() + 1);
        activityProgress.setLastAttemptAt(LocalDateTime.now());

        // Verificar si actividad fue completada (todos los ítems respondidos)
        checkActivityCompletion(activity, activityProgress);

        activityProgressRepository.save(activityProgress);

        // Actualizar progreso de lección (score y actividades completadas)
        updateLessonProgress(lessonProgress, activityProgress, lesson);

        // No se asigna XP al progreso global hasta finalizar lección
        return records.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private List<AnswerRecord> evaluateAnswer(Activity activity, String questionId,
                                              JsonNode userAnswer, ActivityProgress activityProgress) {
        Map<String, Object> config = activity.getConfiguration();
        if (config == null || !config.containsKey("items")) {
            throw new BusinessException("Configuración de actividad inválida");
        }

        List<Map<String, Object>> items = (List<Map<String, Object>>) config.get("items");
        ActivityType type = activity.getType();

        if (type == ActivityType.SORTABLE_LIST) {
            return evaluateSortableList(activity, userAnswer, items, activityProgress);
        }

        // Para el resto de tipos, buscamos el ítem por questionId
        Map<String, Object> item = items.stream()
                .filter(i -> questionId.equals(i.get("id")))
                .findFirst()
                .orElseThrow(() -> new BusinessException("Pregunta no encontrada en la configuración"));

        if (type == ActivityType.TRUE_FALSE) {
            return evaluateTrueFalse(item, userAnswer, activityProgress);
        } else if (type == ActivityType.MULTIPLE_CHOICE) {
            return evaluateMultipleChoice(item, userAnswer, activityProgress);
        } else if (type == ActivityType.MATCH_PAIRS || type == ActivityType.DRAG_DROP_COLUMNS ||
                type == ActivityType.VENN_DIAGRAM || type == ActivityType.SWIPE_CARDS) {
            return evaluateSimpleMatch(item, userAnswer, activityProgress);
        } else if (type == ActivityType.CHATBOT_SIMULATION) {
            return evaluateChatbot(item, userAnswer, activityProgress);
        } else if (type == ActivityType.USER_STORY_BUILDER) {
            return evaluateUserStory(item, userAnswer, activityProgress);
        } else if (type == ActivityType.REWRITE_REQUIREMENT) {
            return evaluateRewrite(item, userAnswer, activityProgress);
        } else {
            throw new BusinessException("Tipo de actividad no soportado");
        }
    }

    private List<AnswerRecord> evaluateTrueFalse(Map<String, Object> item, JsonNode answer, ActivityProgress ap) {
        boolean correct = answer.asBoolean() == (boolean) item.get("correctAnswer");
        return singleRecord(item, answer, correct, ap);
    }

    private List<AnswerRecord> evaluateMultipleChoice(Map<String, Object> item, JsonNode answer, ActivityProgress ap) {
        String userChoice = answer.asText();
        String correct = (String) item.get("correctAnswer");
        boolean isCorrect = correct.equals(userChoice);
        return singleRecord(item, answer, isCorrect, ap);
    }

    private List<AnswerRecord> evaluateSimpleMatch(Map<String, Object> item, JsonNode answer, ActivityProgress ap) {
        String userChoice = answer.asText();
        String correct = (String) item.get("correctAnswer");
        boolean isCorrect = correct.equals(userChoice);
        return singleRecord(item, answer, isCorrect, ap);
    }

    private List<AnswerRecord> evaluateChatbot(Map<String, Object> item, JsonNode answer, ActivityProgress ap) {
        String chosenOption = answer.asText();
        String bestOption = (String) item.get("bestOption");
        List<Map<String, Object>> options = (List<Map<String, Object>>) item.get("options");

        // Buscar multiplicador de puntuación de la opción elegida
        double multiplier = options.stream()
                .filter(o -> chosenOption.equals(o.get("id")))
                .map(o -> (double) o.get("scoreMultiplier"))
                .findFirst()
                .orElse(0.0);

        int scoreReward = (int) item.get("scoreReward");
        int xpReward = (int) item.get("xpReward");
        int points = (int) Math.round(scoreReward * multiplier);
        int xp = (int) Math.round(xpReward * multiplier);

        AnswerRecord record = AnswerRecord.builder()
                .activityProgress(ap)
                .questionId((String) item.get("id"))
                .userAnswer(chosenOption)
                .correct(chosenOption.equals(bestOption))
                .pointsAwarded(points)
                .xpAwarded(xp)
                .build();
        return Collections.singletonList(record);
    }

    private List<AnswerRecord> evaluateUserStory(Map<String, Object> item, JsonNode answer, ActivityProgress ap) {
        Map<String, String> correctAnswers = (Map<String, String>) item.get("correctAnswers");
        JsonNode slots = answer; // debería ser un objeto con slot_rol, slot_accion, slot_beneficio
        boolean allCorrect = correctAnswers.entrySet().stream()
                .allMatch(entry -> {
                    JsonNode slotValue = slots.get(entry.getKey());
                    return slotValue != null && entry.getValue().equals(slotValue.asText());
                });

        int scoreReward = (int) item.get("scoreReward");
        int xpReward = (int) item.get("xpReward");
        int points = allCorrect ? scoreReward : 0;
        int xp = allCorrect ? xpReward : 0;

        AnswerRecord record = AnswerRecord.builder()
                .activityProgress(ap)
                .questionId((String) item.get("id"))
                .userAnswer(answer.toString())
                .correct(allCorrect)
                .pointsAwarded(points)
                .xpAwarded(xp)
                .build();
        return Collections.singletonList(record);
    }

    private List<AnswerRecord> evaluateRewrite(Map<String, Object> item, JsonNode answer, ActivityProgress ap) {
        String userText = answer.asText().trim();
        String expected = ((String) item.get("correctAnswer")).trim();
        // Validación básica: comparación de strings, se podría mejorar con regex
        boolean correct = userText.trim().replaceAll("\\s+", " ").equalsIgnoreCase(expected.trim().replaceAll("\\s+", " "));
        int scoreReward = (int) item.get("scoreReward");
        int xpReward = (int) item.get("xpReward");
        int points = correct ? scoreReward : 0;
        int xp = correct ? xpReward : 0;

        AnswerRecord record = AnswerRecord.builder()
                .activityProgress(ap)
                .questionId((String) item.get("id"))
                .userAnswer(answer.asText())
                .correct(correct)
                .pointsAwarded(points)
                .xpAwarded(xp)
                .build();
        return Collections.singletonList(record);
    }

    private List<AnswerRecord> evaluateSortableList(Activity activity, JsonNode userAnswer,
                                                    List<Map<String, Object>> items, ActivityProgress ap) {
        // userAnswer debe ser un array de strings con los IDs en el orden elegido
        List<String> userOrder = new ArrayList<>();
        for (JsonNode node : userAnswer) {
            userOrder.add(node.asText());
        }

        int maxScore = activity.getMaxScore();
        int maxXp = activity.getMaxXp();
        int itemCount = items.size();
        if (itemCount == 0) {
            throw new BusinessException("Configuración de actividad inválida: no hay elementos para ordenar");
        }
        int pointPerStep = maxScore / itemCount;
        int xpPerStep = maxXp / itemCount;

        List<AnswerRecord> records = new ArrayList<>();
        for (Map<String, Object> item : items) {
            String stepId = (String) item.get("id");
            int correctPosition = (int) item.get("correctOrder");
            boolean isCorrect = userOrder.size() > correctPosition &&
                    userOrder.get(correctPosition).equals(stepId);

            AnswerRecord record = AnswerRecord.builder()
                    .activityProgress(ap)
                    .questionId(stepId)
                    .userAnswer(String.valueOf(userOrder.indexOf(stepId)))
                    .correct(isCorrect)
                    .pointsAwarded(isCorrect ? pointPerStep : 0)
                    .xpAwarded(isCorrect ? xpPerStep : 0)
                    .build();
            records.add(record);
        }
        return records;
    }

    private List<AnswerRecord> singleRecord(Map<String, Object> item, JsonNode answer,
                                            boolean correct, ActivityProgress ap) {
        int score = correct ? (int) item.get("scoreReward") : 0;
        int xp = correct ? (int) item.get("xpReward") : 0;
        AnswerRecord record = AnswerRecord.builder()
                .activityProgress(ap)
                .questionId((String) item.get("id"))
                .userAnswer(answer.asText())
                .correct(correct)
                .pointsAwarded(score)
                .xpAwarded(xp)
                .build();
        return Collections.singletonList(record);
    }

    private void checkActivityCompletion(Activity activity, ActivityProgress activityProgress) {
        Map<String, Object> config = activity.getConfiguration();
        if (config == null) return;

        List<Map<String, Object>> items = (List<Map<String, Object>>) config.get("items");
        if (items == null) return;

        int totalItems = items.size();
        long answeredItems = activityProgress.getAnswers().stream()
                .map(AnswerRecord::getQuestionId)
                .distinct()
                .count();

        if (answeredItems >= totalItems) {
            activityProgress.setCompleted(true);
        }
    }

    private void updateLessonProgress(LessonProgress lp, ActivityProgress ap, Lesson lesson) {
        // Recalcular score total de la lección sumando los scores de todas las actividades del intento actual
        List<ActivityProgress> allActivityProgress = activityProgressRepository
                .findByUserIdAndActivity_LessonId(lp.getUser().getId(), lesson.getId());
        int newTotalScore = allActivityProgress.stream().mapToInt(ActivityProgress::getScore).sum();
        lp.setTotalScore(Math.min(newTotalScore, 100)); // máximo teórico 100

        // Actualizar actividades completadas
        long completedCount = allActivityProgress.stream().filter(ActivityProgress::isCompleted).count();
        lp.setCompletedActivities((int) completedCount);

        lessonProgressRepository.save(lp);
    }

    private User getUserReference(Long userId) {
        // Referencia ligera sin consultar toda la entidad
        return entityManager.getReference(User.class, userId);
    }

    private AnswerRecordResponse mapToResponse(AnswerRecord record) {
        return AnswerRecordResponse.builder()
                .questionId(record.getQuestionId())
                .userAnswer(record.getUserAnswer())
                .correct(record.isCorrect())
                .pointsAwarded(record.getPointsAwarded())
                .xpAwarded(record.getXpAwarded())
                .build();
    }
}