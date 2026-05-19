import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Lightning, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import FloatingFeedback from "./FloatingFeedback";
import { Howl } from "howler";

const correctSound = new Howl({ src: ["/sounds/correct.mp3"] });
const incorrectSound = new Howl({ src: ["/sounds/incorrect.mp3"] });

export default function SwipeCardsActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [exitDirection, setExitDirection] = useState(null); // 'left' o 'right'
  const completedRef = useRef(false);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      const initial = {};
      initialAnswers.forEach((a, idx) => {
        initial[a.questionId] = {
          userAnswer: a.userAnswer,
          correct: a.correct,
          xp: a.xpAwarded || 0,
          points: a.pointsAwarded || 0,
        };
      });
      setAnswers(initial);
      // Si todas respondidas, marcar completada
      if (
        Object.keys(initial).length === items.length &&
        !completedRef.current
      ) {
        completedRef.current = true;
        const totalScore = Object.values(initial).reduce(
          (s, a) => s + a.points,
          0,
        );
        const totalXp = Object.values(initial).reduce((s, a) => s + a.xp, 0);
        onActivityComplete(totalScore, totalXp);
      }
    }
  }, [initialAnswers, items]);

  const currentItem = items[currentIndex];

  const handleDragEnd = useCallback(
    async (_, info) => {
      if (answers[currentItem?.id] || submitting) return;
      const threshold = (cardRef.current?.offsetWidth || 300) * 0.3;
      if (Math.abs(info.offset.x) > threshold) {
        const direction = info.offset.x > 0 ? "right" : "left";
        const isCorrect = currentItem.correctAnswer === direction;
        const points = isCorrect ? currentItem.scoreReward : 0;
        const xp = isCorrect ? currentItem.xpReward : 0;

        setExitDirection(direction);
        setSubmitting(true);

        // Animación de salida
        setTimeout(async () => {
          const newAnswer = {
            userAnswer: direction,
            correct: isCorrect,
            points,
            xp,
          };
          setAnswers((prev) => ({ ...prev, [currentItem.id]: newAnswer }));
          setFeedback({ correct: isCorrect, xp });
          if (isCorrect) correctSound.play();
          else incorrectSound.play();

          try {
            await onSubmitAnswer(activityId, currentItem.id, direction);
          } catch (err) {
            console.error("Error:", err);
          }

          setSubmitting(false);
          setExitDirection(null);
          x.set(0); // reset motion value

          if (currentIndex < items.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            // Última tarjeta
            const allAnswers = { ...answers, [currentItem.id]: newAnswer };
            const totalScore = Object.values(allAnswers).reduce(
              (s, a) => s + a.points,
              0,
            );
            const totalXp = Object.values(allAnswers).reduce(
              (s, a) => s + a.xp,
              0,
            );
            if (!completedRef.current) {
              completedRef.current = true;
              onActivityComplete(totalScore, totalXp);
            }
          }
        }, 300);
      } else {
        // Regresar al centro
        x.set(0);
      }
    },
    [
      answers,
      currentItem,
      submitting,
      activityId,
      onSubmitAnswer,
      currentIndex,
      items,
      x,
    ],
  );

  const handleButtonSwipe = (direction) => {
    if (answers[currentItem?.id] || submitting) return;
    const threshold = (cardRef.current?.offsetWidth || 300) * 0.3 + 10;
    if (direction === "right") {
      x.set(threshold);
    } else {
      x.set(-threshold);
    }
    // Simular dragEnd con offset suficiente
    handleDragEnd(null, {
      offset: { x: direction === "right" ? threshold + 1 : -(threshold + 1) },
    });
  };

  return (
    <div className="p-4 md:py-8 md:px-60">
      <div className="max-w-md mx-auto relative flex flex-col items-center">
        {/* Contador */}
        <div className="mb-4 text-sm font-medium text-slate-500">
          Tarjeta {currentIndex + 1} de {items.length}
        </div>

        <div className="relative w-full h-80">
          {currentItem && !answers[currentItem.id] && (
            <motion.div
              ref={cardRef}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ x, rotate, opacity }}
              animate={
                exitDirection
                  ? { x: exitDirection === "right" ? 400 : -400, opacity: 0 }
                  : {}
              }
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 flex flex-col justify-center items-center text-center cursor-grab active:cursor-grabbing"
            >
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl font-semibold text-slate-800 leading-relaxed">
                {currentItem.prompt}
              </p>
              <div className="absolute bottom-4 left-4 text-xs text-slate-400 flex items-center gap-1">
                <ArrowLeft size={16} /> Incorrecto
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-slate-400 flex items-center gap-1">
                Correcto <ArrowRight size={16} />
              </div>
            </motion.div>
          )}

          {answers[currentItem?.id] && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 flex flex-col justify-center items-center text-center"
            >
              <div className="text-6xl mb-4">
                {answers[currentItem.id].correct ? "🎉" : "😞"}
              </div>
              <p className="text-xl font-semibold text-slate-800">
                {currentItem.prompt}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {answers[currentItem.id].userAnswer === "right"
                  ? "Derecha"
                  : "Izquierda"}
              </p>
              {feedback && (
                <FloatingFeedback
                  show={true}
                  correct={feedback.correct}
                  xp={feedback.xp}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Botones de acción (alternativa a drag) */}
        {currentItem && !answers[currentItem.id] && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => handleButtonSwipe("left")}
              className="w-14 h-14 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shadow-md hover:bg-rose-200 transition"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={() => handleButtonSwipe("right")}
              className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shadow-md hover:bg-emerald-200 transition"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
