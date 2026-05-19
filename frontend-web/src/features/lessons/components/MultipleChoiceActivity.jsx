import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import FloatingFeedback from "./FloatingFeedback";
import { Howl } from "howler";

const correctSound = new Howl({ src: ["/sounds/correct.mp3"] });
const incorrectSound = new Howl({ src: ["/sounds/incorrect.mp3"] });

export default function MultipleChoiceActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const item = items[0]; // solo hay uno
  const [answer, setAnswer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      const a = initialAnswers[0];
      setAnswer({
        userAnswer: a.userAnswer,
        correct: a.correct,
        xp: a.xpAwarded,
        points: a.pointsAwarded,
      });
      // Ya está completada, llamar a onActivityComplete
      if (!completedRef.current) {
        completedRef.current = true;
        onActivityComplete(a.pointsAwarded, a.xpAwarded);
      }
    }
  }, [initialAnswers, onActivityComplete]);

  const handleSelect = useCallback(
    async (optionValue) => {
      if (answer || submitting) return;
      setSubmitting(true);

      const isCorrect = item.correctAnswer === optionValue;
      const points = isCorrect ? item.scoreReward : 0;
      const xp = isCorrect ? item.xpReward : 0;
      const newAnswer = {
        userAnswer: optionValue,
        correct: isCorrect,
        points,
        xp,
      };
      setAnswer(newAnswer);
      setFeedback({ correct: isCorrect, xp });

      if (isCorrect) correctSound.play();
      else incorrectSound.play();

      try {
        await onSubmitAnswer(activityId, item.id, optionValue);
      } catch (err) {
        console.error("Error al enviar respuesta:", err);
      }
      setSubmitting(false);

      if (!completedRef.current) {
        completedRef.current = true;
        onActivityComplete(points, xp);
      }
    },
    [answer, submitting, item, activityId, onSubmitAnswer, onActivityComplete],
  );

  return (
    <div className="p-4 md:py-8 md:px-60">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-blue-50/50">
          <h3 className="text-lg font-semibold text-slate-800">
            {item.prompt}
          </h3>
        </div>
        <div className="p-6 space-y-3">
          {item.options.map((option) => {
            const isSelected = answer?.userAnswer === option.value;
            const isCorrectOption = option.value === item.correctAnswer;
            return (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option.value)}
                disabled={!!answer || submitting}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? isCorrectOption
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-rose-400 bg-rose-50"
                    : answer
                      ? isCorrectOption
                        ? "border-emerald-200 bg-emerald-50/50" // mostrar correcta aunque no seleccionada
                        : "border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed"
                      : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  {isSelected &&
                    (isCorrectOption ? (
                      <CheckCircle size={20} className="text-emerald-500" />
                    ) : (
                      <XCircle size={20} className="text-rose-500" />
                    ))}
                  {!isSelected && answer && isCorrectOption && (
                    <CheckCircle size={20} className="text-emerald-400" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      <FloatingFeedback
        show={!!feedback}
        correct={feedback?.correct}
        xp={feedback?.xp}
      />
    </div>
  );
}
