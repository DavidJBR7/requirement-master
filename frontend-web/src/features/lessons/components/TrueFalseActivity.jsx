import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Check, X } from "@phosphor-icons/react";
import FloatingFeedback from "./FloatingFeedback";

export default function TrueFalseActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const [localAnswers, setLocalAnswers] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hasCompleted] = useState(false);

  // Inicializar con respuestas previas del progreso guardado
  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      const initial = {};
      initialAnswers.forEach((a) => {
        initial[a.questionId] = {
          userAnswer: a.userAnswer === true || a.userAnswer === "true",
          correct: a.correct,
          xp: a.xpAwarded || 0,
          points: a.pointsAwarded || 0,
        };
      });
      setLocalAnswers(initial);
    }
  }, [initialAnswers, items.length]);

  // Calcular totales cuando se complete
  useEffect(() => {
    if (hasCompleted) {
      const totalScore = Object.values(localAnswers).reduce(
        (sum, ans) => sum + (ans.points || 0),
        0,
      );
      const totalXp = Object.values(localAnswers).reduce(
        (sum, ans) => sum + (ans.xp || 0),
        0,
      );
      onActivityComplete(totalScore, totalXp);
    }
  }, [hasCompleted, localAnswers, onActivityComplete]);

  const answersRef = useRef(localAnswers);

  useEffect(() => {
    answersRef.current = localAnswers;
  }, [localAnswers]);

  const handleAnswer = useCallback(
    async (itemId, value) => {
      if (submittingId || answersRef.current[itemId]) return;
      setSubmittingId(itemId);
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      const isCorrect = item.correctAnswer == value;
      const newAnswer = {
        userAnswer: value,
        correct: isCorrect,
        points: isCorrect ? item.scoreReward || 0 : 0,
        xp: isCorrect ? item.xpReward || 0 : 0,
      };

      setLocalAnswers((prev) => {
        const updated = { ...prev, [itemId]: newAnswer };
        return updated;
      });

      // Calcular si ya se respondieron todas
      const updatedAnswers = { ...answersRef.current, [itemId]: newAnswer };
      if (Object.keys(updatedAnswers).length === items.length) {
        const totalScore = Object.values(updatedAnswers).reduce(
          (s, a) => s + (a.points || 0),
          0,
        );
        const totalXp = Object.values(updatedAnswers).reduce(
          (s, a) => s + (a.xp || 0),
          0,
        );
        onActivityComplete(totalScore, totalXp);
      }

      setFeedback({ itemId, correct: isCorrect, xp: newAnswer.xp });
      try {
        await onSubmitAnswer(activityId, itemId, value);
      } catch (error) {
        console.error("Error al enviar respuesta:", error);
      }
      setSubmittingId(null);
    },
    [submittingId, items, activityId, onSubmitAnswer, onActivityComplete],
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
              show={feedback?.itemId == item.id}
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
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 leading-relaxed">
                    {item.prompt}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleAnswer(item.id, true)}
                  disabled={isAnswered || !!submittingId}
                  className={`
                    py-2 rounded-2xl border flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer
                    ${
                      isAnswered && answer.userAnswer == true
                        ? isCorrect
                          ? "bg-emerald-400 border-emerald-500 text-white"
                          : "bg-rose-400 border-rose-500 text-white"
                        : `border-slate-200 bg-white hover:bg-blue-200 hover:border-2 hover:border-blue-300 text-slate-700 cursor-pointer`
                    }
                  `}
                >
                  <Check size={18} weight="bold" />
                  Verdadero
                </button>

                <button
                  type="button"
                  onClick={() => handleAnswer(item.id, false)}
                  disabled={isAnswered || !!submittingId}
                  className={`
                    py-2 rounded-2xl border flex items-center justify-center gap-2 font-semibold transition-all duration-200 
                    ${
                      isAnswered && answer.userAnswer == false
                        ? isCorrect
                          ? "bg-emerald-400 border-emerald-500 text-white"
                          : "bg-rose-400 border-rose-500 text-white"
                        : `border-slate-200 bg-white hover:bg-blue-200 hover:border-2 hover:border-blue-300 text-slate-700 cursor-pointer`
                    }
                  `}
                >
                  <X size={18} weight="bold" />
                  Falso
                </button>
              </div>
            </div>
          </motion.fieldset>
        );
      })}
    </div>
  );
}
