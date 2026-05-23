package com.requirementmaster.backend.application.service;

import com.requirementmaster.backend.application.dto.request.ActivityAnswerRequest;
import com.requirementmaster.backend.application.dto.response.ActivityFullResponse;
import com.requirementmaster.backend.application.dto.response.AnswerRecordResponse;
import com.requirementmaster.backend.domain.entities.*;
import com.requirementmaster.backend.domain.enums.ActivityType;
import com.requirementmaster.backend.domain.enums.LessonProgressStatus;
import com.requirementmaster.backend.domain.exceptions.BusinessException;
import com.requirementmaster.backend.domain.exceptions.ResourceNotFoundException;
import com.requirementmaster.backend.infrastructure.persistence.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final JpaActivityRepository activityRepository;
    private final JpaActivityProgressRepository activityProgressRepository;
    private final JpaLessonProgressRepository lessonProgressRepository;
    private final JpaAnswerRecordRepository answerRecordRepository;
    private final EntityManager entityManager;

    private static final ConcurrentHashMap<String, Object> progressLocks = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public ActivityFullResponse getActivity(Long activityId, Long userId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", activityId));

        Lesson lesson = activity.getLesson();
        if (lesson.isExam()) {
            LessonProgress lessonProgress = lessonProgressRepository
                    .findByUserIdAndLessonId(userId, lesson.getId())
                    .orElse(null);
            if (lessonProgress != null && !lessonProgress.isFinalized()) {
                throw new BusinessException(
                        "El examen debe completarse en una sola sesión. Debes reiniciarlo para intentarlo de nuevo."
                );
            }
        }

        // Solo el progreso activo (intento actual)
        ActivityProgress progress = activityProgressRepository
                .findByUserIdAndActivityIdAndActiveTrue(userId, activityId)
                .orElse(null);
        return ActivityFullResponse.from(activity, progress);
    }

    @Transactional
    public List<AnswerRecordResponse> processAnswer(ActivityAnswerRequest request, Long userId) {
        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity", request.getActivityId()));

        Lesson lesson = activity.getLesson();
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
                    .status(LessonProgressStatus.IN_PROGRESS)
                    .totalActivities(lesson.getActivities().size())
                    .build();
            lessonProgress = lessonProgressRepository.save(lessonProgress);
        } else if (lessonProgress.getStatus() != LessonProgressStatus.IN_PROGRESS) {
            // Si el LessonProgress existía pero no está en progreso (ej. AVAILABLE por reprobado),
            // IN_PROGRESS porque el usuario está retomando la lección.
            lessonProgress.setStatus(LessonProgressStatus.IN_PROGRESS);
            lessonProgressRepository.save(lessonProgress);
        }

        ActivityProgress activityProgress = getOrCreateActivityProgress(userId, activity);

        if (activityProgress.getAnswers().stream()
                .anyMatch(ar -> ar.getQuestionId().equals(request.getQuestionId()))) {
            throw new BusinessException("Esta pregunta ya fue respondida en este intento.");
        }

        JsonNode answerNode = objectMapper.convertValue(request.getUserAnswer(), JsonNode.class);
        List<AnswerRecord> records = evaluateAnswer(activity, request.getQuestionId(), answerNode, activityProgress);

        for (AnswerRecord record : records) {
            activityProgress.setScore(activityProgress.getScore() + record.getPointsAwarded());
            activityProgress.setXpEarned(activityProgress.getXpEarned() + record.getXpAwarded());
            activityProgress.getAnswers().add(record);
            answerRecordRepository.save(record);
        }

        checkActivityCompletion(activity, activityProgress);
        activityProgressRepository.save(activityProgress);

        updateLessonProgress(lessonProgress, activityProgress, lesson);

        return records.stream()
                .map(AnswerRecordResponse::from)
                .collect(Collectors.toList());
    }

    // Métodos de evaluación se mantienen igual ...
    // (omito el cuerpo por brevedad, pero van exactamente igual que en tu código original)

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

        double multiplier = options.stream()
                .filter(o -> chosenOption.equals(o.get("id")))
                .map(o -> {
                    Object value = o.get("scoreMultiplier");
                    // Manejar tanto Integer como Double
                    if (value instanceof Integer) {
                        return ((Integer) value).doubleValue();
                    } else if (value instanceof Double) {
                        return (Double) value;
                    } else if (value instanceof Number) {
                        return ((Number) value).doubleValue();
                    }
                    return 0.0;
                })
                .findFirst()
                .orElse(0.0);

        int scoreReward = ((Number) item.get("scoreReward")).intValue();
        int xpReward = ((Number) item.get("xpReward")).intValue();
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
        JsonNode slots = answer;
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
        boolean correct = userText.replaceAll("\\s+", " ").equalsIgnoreCase(expected.replaceAll("\\s+", " "));
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
        List<String> userOrder = new ArrayList<>();
        for (JsonNode node : userAnswer) {
            userOrder.add(node.asText());
        }

        int maxScore = activity.getMaxScore();
        int maxXp = activity.getMaxXp();
        int itemCount = items.size();
        if (itemCount == 0) throw new BusinessException("Configuración de actividad inválida: no hay elementos para ordenar");
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
        // Solo suma los progresos activos (intento actual)
        List<ActivityProgress> allActivityProgress = activityProgressRepository
                .findByUserIdAndActivity_LessonIdAndActiveTrue(lp.getUser().getId(), lesson.getId());
        int newTotalScore = allActivityProgress.stream().mapToInt(ActivityProgress::getScore).sum();
        lp.setTotalScore(Math.min(newTotalScore, 100));

        long completedCount = allActivityProgress.stream().filter(ActivityProgress::isCompleted).count();
        lp.setCompletedActivities((int) completedCount);

        lessonProgressRepository.save(lp);
    }

    private User getUserReference(Long userId) {
        return entityManager.getReference(User.class, userId);
    }

    private ActivityProgress getOrCreateActivityProgress(Long userId, Activity activity) {
        String lockKey = userId + "_" + activity.getId();
        Object lock = progressLocks.computeIfAbsent(lockKey, k -> new Object());
        synchronized (lock) {
            // Busca solo el activo
            ActivityProgress progress = activityProgressRepository
                    .findByUserIdAndActivityIdAndActiveTrue(userId, activity.getId())
                    .orElse(null);
            if (progress == null) {
                progress = ActivityProgress.builder()
                        .user(getUserReference(userId))
                        .activity(activity)
                        .active(true)          // explícitamente activo
                        .build();
                progress = activityProgressRepository.save(progress);
            }
            return progress;
        }
    }
}
