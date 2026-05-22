import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import FloatingFeedback from "./FloatingFeedback";
import { playSound } from "../../../utils/soundManager";

export default function MultipleChoiceActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const [localAnswers, setLocalAnswers] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Inicializar con respuestas previas del progreso guardado
  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      const initial = {};
      initialAnswers.forEach((a) => {
        initial[a.questionId] = {
          userAnswer: a.userAnswer,
          correct: a.correct,
          points: a.pointsAwarded || 0,
          xp: a.xpAwarded || 0,
        };
      });
      setLocalAnswers(initial);
    }
  }, [initialAnswers]);

  // Notificar finalización cuando todas las preguntas tengan respuesta
  useEffect(() => {
    if (hasCompleted) {
      onActivityComplete();
    }
  }, [hasCompleted, onActivityComplete]);

  const handleSelect = useCallback(
    async (itemId, value) => {
      if (submittingId || localAnswers[itemId]) return;
      setSubmittingId(itemId);

      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      const isCorrect = item.correctAnswer === value;
      playSound(isCorrect ? "correct" : "wrong");

      const newAnswer = {
        userAnswer: value,
        correct: isCorrect,
        points: isCorrect ? item.scoreReward || 0 : 0,
        xp: isCorrect ? item.xpReward || 0 : 0,
      };

      setLocalAnswers((prev) => {
        const updated = { ...prev, [itemId]: newAnswer };
        if (Object.keys(updated).length === items.length) {
          setHasCompleted(true);
        }
        return updated;
      });

      setFeedback({ itemId, correct: isCorrect, xp: newAnswer.xp });

      try {
        await onSubmitAnswer(activityId, itemId, value);
      } catch (error) {
        console.error("Error al enviar respuesta:", error);
      }

      setSubmittingId(null);
    },
    [submittingId, localAnswers, items, activityId, onSubmitAnswer],
  );

  // Limpiar feedback después de 1.8s
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 1800);
    return () => clearTimeout(timer);
  }, [feedback]);

  return (
    <div className="space-y-6 p-4 md:py-8 md:px-60">
      {items.map((item, index) => {
        const answer = localAnswers[item.id];
        const isAnswered = !!answer;
        const isCorrect = answer?.correct;

        return (
          <motion.fieldset
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              relative overflow-hidden rounded-2xl border-2 transition-all duration-300
              ${
                isAnswered
                  ? isCorrect
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-red-400 bg-rose-50"
                  : "border-blue-400 bg-blue-50"
              }
            `}
          >
            <FloatingFeedback
              show={feedback?.itemId === item.id}
              correct={feedback?.correct}
              xp={feedback?.xp}
            />

            <legend
              className={`text-base font-bold ml-6 px-10 py-1 border-2 rounded-2xl text-white
                ${
                  isAnswered
                    ? isCorrect
                      ? "border-emerald-400 bg-emerald-400"
                      : "border-red-400 bg-rose-400"
                    : "border-blue-400 bg-blue-400"
                }`}
            >
              Pregunta {index + 1}
            </legend>

            <div className="p-4 md:p-6 md:pt-4">
              <h3 className="text-base md:text-lg font-semibold text-slate-800 leading-relaxed mb-4">
                {item.prompt}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.options.map((opt) => {
                  const isSelected = answer?.userAnswer === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(item.id, opt.value)}
                      disabled={isAnswered || !!submittingId}
                      className={`
                        py-3 px-4 rounded-2xl border flex items-start gap-2 font-medium transition-all duration-200 text-left
                        ${
                          isAnswered
                            ? isSelected
                              ? isCorrect
                                ? "bg-emerald-400 border-emerald-500 text-white"
                                : "bg-rose-400 border-rose-500 text-white"
                              : "border-slate-200 bg-white text-slate-500"
                            : "border-slate-200 bg-white hover:bg-blue-100 hover:border-blue-300 text-slate-700 cursor-pointer"
                        }
                      `}
                    >
                      <span className="flex-shrink-0 mt-0.5">
                        {isAnswered && isSelected ? (
                          isCorrect ? (
                            <CheckCircle size={20} weight="fill" />
                          ) : (
                            <XCircle size={20} weight="fill" />
                          )
                        ) : (
                          <span className="w-5 h-5 rounded-full border-2 border-current" />
                        )}
                      </span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.fieldset>
        );
      })}
    </div>
  );
}
