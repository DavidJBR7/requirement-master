import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightning, ChatCircle, ArrowRight } from "@phosphor-icons/react";
import FloatingFeedback from "./FloatingFeedback";
import { Howl } from "howler";

const correctSound = new Howl({ src: ["/sounds/correct.mp3"] });
const incorrectSound = new Howl({ src: ["/sounds/incorrect.mp3"] });

export default function ChatbotSimulationActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
  maxScore,
  maxXp,
}) {
  const totalRounds = items.length;
  const [currentRound, setCurrentRound] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [roundTransition, setRoundTransition] = useState(false);
  const answersRef = useRef(answers);
  const activityCompletedRef = useRef(false);

  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      const initial = {};
      initialAnswers.forEach((a) => {
        initial[a.questionId] = {
          userAnswer: a.userAnswer,
          correct: a.correct,
          xp: a.xpAwarded || 0,
          points: a.pointsAwarded || 0,
        };
      });
      setAnswers(initial);
      // Determinar la ronda actual en base a las respuestas existentes
      const answeredRounds = new Set(Object.keys(initial));
      for (let i = 0; i < items.length; i++) {
        if (!answeredRounds.has(items[i].id)) {
          setCurrentRound(i);
          break;
        }
      }
    }
  }, [initialAnswers, items]);

  useEffect(() => {
    answersRef.current = answers;
    // Verificar si todas las rondas están respondidas
    if (
      Object.keys(answers).length === totalRounds &&
      !activityCompletedRef.current
    ) {
      activityCompletedRef.current = true;
      const totalScore = Object.values(answers).reduce(
        (s, a) => s + (a.points || 0),
        0,
      );
      const totalXp = Object.values(answers).reduce(
        (s, a) => s + (a.xp || 0),
        0,
      );
      onActivityComplete(totalScore, totalXp);
    }
  }, [answers, totalRounds, onActivityComplete]);

  const handleSelectOption = useCallback(
    async (option) => {
      if (submitting || answers[items[currentRound].id]) return;
      setSubmitting(true);

      const item = items[currentRound];
      const isBest = option.id === item.bestOption;
      const scoreMultiplier = option.scoreMultiplier || 0;
      const points = Math.round(item.scoreReward * scoreMultiplier);
      const xp = isBest
        ? item.xpReward
        : Math.round(item.xpReward * scoreMultiplier);
      const userAnswer = option.id;
      const newAnswer = {
        userAnswer,
        correct: scoreMultiplier >= 0.8,
        points,
        xp,
      };

      // Actualizar estado local
      setAnswers((prev) => ({ ...prev, [item.id]: newAnswer }));
      setFeedback({ correct: newAnswer.correct, xp });

      // Reproducir sonido
      if (newAnswer.correct) correctSound.play();
      else incorrectSound.play();

      try {
        await onSubmitAnswer(activityId, item.id, userAnswer);
      } catch (error) {
        console.error("Error al enviar respuesta:", error);
      }

      setSubmitting(false);
      // Avanzar a la siguiente ronda con transición
      if (currentRound < totalRounds - 1) {
        setRoundTransition(true);
        setTimeout(() => {
          setCurrentRound((prev) => prev + 1);
          setRoundTransition(false);
        }, 500);
      }
    },
    [
      submitting,
      answers,
      currentRound,
      items,
      activityId,
      onSubmitAnswer,
      totalRounds,
    ],
  );

  const currentItem = items[currentRound];
  const answeredCurrent = !!answers[currentItem?.id];
  const lastFeedback = feedback;

  return (
    <div className="p-4 md:py-8 md:px-60 space-y-4">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            {/* Avatar y mensaje */}
            <div className="p-6 bg-blue-50/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {currentItem.avatar === "cliente" ? "👤" : "🤖"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-800 mb-1">
                    {currentItem.avatar === "cliente"
                      ? "Cliente"
                      : "Entrevistador"}
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {currentItem.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Opciones */}
            <div className="p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Elige tu respuesta
              </h3>
              <div className="space-y-2">
                {currentItem.options.map((option) => {
                  const isSelected =
                    answers[currentItem.id]?.userAnswer === option.id;
                  const isDisabled = answeredCurrent || submitting;
                  return (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOption(option)}
                      disabled={isDisabled}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? option.scoreMultiplier >= 0.8
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-rose-400 bg-rose-50"
                          : isDisabled
                            ? "border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.text}</span>
                        {isSelected && (
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              option.scoreMultiplier >= 0.8
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {option.scoreMultiplier >= 0.8 ? "✅" : "❌"}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback flotante */}
        <FloatingFeedback
          show={!!lastFeedback}
          correct={lastFeedback?.correct}
          xp={lastFeedback?.xp}
        />

        {/* Barra de progreso */}
        <div className="mt-4 bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>
              Ronda {currentRound + 1} de {totalRounds}
            </span>
            <span>
              Confianza:{" "}
              {Math.round(
                (Object.keys(answers).filter((id) => answers[id]?.correct)
                  .length /
                  totalRounds) *
                  100,
              )}
              %
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
              style={{
                width: `${(Object.keys(answers).length / totalRounds) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Botón continuar después de responder (opcional) */}
        {answeredCurrent && currentRound < totalRounds - 1 && (
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                setCurrentRound((prev) => prev + 1);
                setFeedback(null);
              }}
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
            >
              Continuar <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
