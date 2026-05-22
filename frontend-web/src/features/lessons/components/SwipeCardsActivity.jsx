import { useState, useCallback, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  HeartStraight,
  Sparkle,
} from "@phosphor-icons/react";

import FloatingFeedback from "./FloatingFeedback";
import { playSound } from "../../../utils/soundManager";

export default function SwipeCardsActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // -----------------------------
  // INIT
  // -----------------------------
  useEffect(() => {
    if (initialAnswers?.length > 0) {
      const ans = {};

      initialAnswers.forEach((a) => {
        ans[a.questionId] = {
          userAnswer: a.userAnswer,
          correct: a.correct,
          points: a.pointsAwarded || 0,
          xp: a.xpAwarded || 0,
        };
      });

      setAnswers(ans);

      const firstUnanswered = items.findIndex((i) => !ans[i.id]);

      setCurrentIndex(firstUnanswered === -1 ? items.length : firstUnanswered);
    }
  }, [initialAnswers, items]);

  const allAnswered = Object.keys(answers).length === items.length;

  // -----------------------------
  // COMPLETE
  // -----------------------------
  useEffect(() => {
    if (allAnswered && !completed) {
      setCompleted(true);

      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.7 },
      });

      onActivityComplete();
    }
  }, [allAnswered, completed, onActivityComplete]);

  // -----------------------------
  // FEEDBACK
  // -----------------------------
  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => {
      setFeedback(null);
    }, 1800);

    return () => clearTimeout(timer);
  }, [feedback]);

  // -----------------------------
  // ANSWER
  // -----------------------------
  const handleAnswer = useCallback(
    async (itemId, value) => {
      if (isAnimating || answers[itemId]) return;

      setIsAnimating(true);

      const item = items.find((i) => i.id === itemId);

      if (!item) return;

      const isCorrect = item.correctAnswer === value;

      playSound(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.8 },
        });
      }

      const newAnswer = {
        userAnswer: value,
        correct: isCorrect,
        points: isCorrect ? item.scoreReward || 0 : 0,
        xp: isCorrect ? item.xpReward || 0 : 0,
      };

      setAnswers((prev) => ({
        ...prev,
        [itemId]: newAnswer,
      }));

      setFeedback({
        itemId,
        correct: isCorrect,
        xp: newAnswer.xp,
      });

      try {
        await onSubmitAnswer(activityId, itemId, value);
      } catch (error) {
        console.error("Error enviando respuesta:", error);
      }

      setDirection(value === "right" ? 1 : -1);

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setDirection(null);
        setIsAnimating(false);
      }, 320);
    },
    [isAnimating, answers, items, activityId, onSubmitAnswer],
  );

  // -----------------------------
  // PROGRESS
  // -----------------------------
  const progress = useMemo(() => {
    return (Object.keys(answers).length / items.length) * 100;
  }, [answers, items.length]);

  const currentItem = items[currentIndex];

  if (completed) {
    const totalXp = Object.values(answers).reduce(
      (acc, a) => acc + (a.xp || 0),
      0,
    );

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          <div className="rounded-[2rem] sm:rounded-[2.5rem] bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_80px_rgba(59,130,246,0.18)] p-6 sm:p-10">
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="mx-auto w-fit"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-xl">
                <HeartStraight
                  size={36}
                  weight="fill"
                  className="text-white sm:hidden"
                />
                <HeartStraight
                  size={54}
                  weight="fill"
                  className="text-white hidden sm:block"
                />
              </div>
            </motion.div>

            <h2 className="mt-6 sm:mt-8 text-center text-3xl sm:text-4xl font-black text-slate-800">
              ¡Completado!
            </h2>

            <p className="mt-2 sm:mt-3 text-center text-slate-500 text-base sm:text-lg">
              Has terminado todas las tarjetas correctamente.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="rounded-2xl sm:rounded-3xl bg-sky-50 border border-sky-100 p-4 sm:p-5 text-center">
                <p className="text-slate-500 text-xs sm:text-sm">Tarjetas</p>
                <p className="text-2xl sm:text-3xl font-black text-sky-600 mt-1">
                  {items.length}
                </p>
              </div>

              <div className="rounded-2xl sm:rounded-3xl bg-indigo-50 border border-indigo-100 p-4 sm:p-5 text-center">
                <p className="text-slate-500 text-xs sm:text-sm">XP ganada</p>
                <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
                  +{totalXp}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentItem) return null;

  const isCorrect = answers[currentItem.id]?.correct;
  const showFeedback = feedback?.itemId === currentItem.id;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 60, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
          }}
          className="absolute top-[-10%] left-[-10%] w-[16rem] sm:w-[26rem] h-[16rem] sm:h-[26rem] rounded-full bg-sky-300/30 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 40, -20, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[16rem] sm:w-[26rem] h-[16rem] sm:h-[26rem] rounded-full bg-indigo-300/30 blur-3xl"
        />
      </div>

      <FloatingFeedback
        show={showFeedback}
        correct={feedback?.correct}
        xp={feedback?.xp}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-sky-600 mb-1 sm:mb-2">
              <Sparkle size={14} weight="fill" className="sm:hidden" />
              <Sparkle size={18} weight="fill" className="hidden sm:block" />
              <span className="font-semibold text-[10px] sm:text-sm uppercase tracking-wider">
                Swipe Activity
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-5xl font-black text-slate-800 truncate">
              Clasifica las tarjetas
            </h1>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-white/70 backdrop-blur-xl border border-white px-3 sm:px-5 py-2 sm:py-3 shadow-lg">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-sky-100 flex items-center justify-center">
              <HeartStraight
                size={18}
                weight="fill"
                className="text-sky-600 sm:hidden"
              />
              <HeartStraight
                size={22}
                weight="fill"
                className="text-sky-600 hidden sm:block"
              />
            </div>

            <div>
              <p className="text-[10px] sm:text-xs text-slate-400">Progreso</p>
              <p className="text-sm sm:text-lg font-black text-slate-700">
                {currentIndex + 1}/{items.length}
              </p>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mb-6 sm:mb-10">
          <div className="h-3 sm:h-4 rounded-full overflow-hidden bg-white/70 border border-white shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${progress}%`,
              }}
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"
            />
          </div>
        </div>

        {/* CARD AREA */}
        <div className="relative flex items-center justify-center h-[calc(100dvh-280px)] sm:h-[70vh]">
          {/* STACK */}
          {[2, 1].map((layer) => (
            <motion.div
              key={layer}
              animate={{
                scale: 1 - layer * 0.04,
                y: layer * 12,
                opacity: 0.5,
              }}
              className="absolute w-full max-w-md sm:max-w-2xl h-[420px] sm:h-[620px] rounded-[2rem] sm:rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white shadow-[0_20px_60px_rgba(59,130,246,0.08)]"
            />
          ))}

          <SwipeableCard
            key={currentItem.id}
            item={currentItem}
            direction={direction}
            onAnswer={handleAnswer}
            isAnimating={isAnimating}
            answered={answers[currentItem.id]}
            isCorrect={isCorrect}
          />
        </div>
      </div>
    </div>
  );
}

function SwipeableCard({
  item,
  direction,
  onAnswer,
  isAnimating,
  answered,
  isCorrect,
}) {
  const x = useMotionValue(0);

  const rotate = useTransform(x, [-250, 250], [-16, 16]);

  const leftOpacity = useTransform(x, [-150, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, 150], [0, 1]);

  const scale = useTransform(x, [-250, 0, 250], [0.97, 1, 0.97]);

  return (
    <AnimatePresence>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.14}
        onDragEnd={(_, info) => {
          if (info.offset.x > 120) {
            onAnswer(item.id, "right");
          } else if (info.offset.x < -120) {
            onAnswer(item.id, "left");
          }
        }}
        style={{
          x,
          rotate,
          scale,
        }}
        initial={{
          opacity: 0,
          scale: 0.85,
          y: 40,
        }}
        animate={{
          opacity: direction ? 0 : 1,
          scale: direction ? 0.8 : 1,
          x: direction ? direction * 500 : 0,
          rotate: direction ? direction * 22 : 0,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="relative w-full max-w-md sm:max-w-2xl h-[420px] sm:h-[620px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden touch-none"
      >
        {/* MAIN CARD */}
        <div className="absolute inset-0 rounded-[2rem] sm:rounded-[3rem] bg-white/80 backdrop-blur-2xl border border-white shadow-[0_25px_80px_rgba(59,130,246,0.18)]" />

        {/* TOP GRADIENT */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-sky-100/80 to-transparent" />

        {/* SWIPE OVERLAYS */}
        <motion.div
          style={{ opacity: leftOpacity }}
          className="absolute inset-0 bg-gradient-to-r from-red-400/25 to-transparent z-10 pointer-events-none rounded-[2rem] sm:rounded-[3rem]"
        />

        <motion.div
          style={{ opacity: rightOpacity }}
          className="absolute inset-0 bg-gradient-to-l from-emerald-400/25 to-transparent z-10 pointer-events-none rounded-[2rem] sm:rounded-[3rem]"
        />

        {/* BADGES */}
        <motion.div
          style={{ opacity: leftOpacity }}
          className="absolute top-6 sm:top-10 left-6 sm:left-10 z-20 rotate-[-15deg]"
        >
          <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-4 border-red-500 bg-white text-red-500 font-black text-lg sm:text-2xl shadow-xl">
            {item.left_label}
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: rightOpacity }}
          className="absolute top-6 sm:top-10 right-6 sm:right-10 z-20 rotate-[15deg]"
        >
          <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-4 border-emerald-500 bg-white text-emerald-500 font-black text-lg sm:text-2xl shadow-xl">
            {item.right_label}
          </div>
        </motion.div>

        {/* CONTENT */}
        <div className="relative z-20 h-full flex flex-col p-6 sm:p-10">
          {/* TOP */}
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-sky-100 text-sky-700 px-3 sm:px-5 py-1.5 sm:py-2 font-bold text-xs sm:text-sm">
              Tarjeta interactiva
            </div>

            {answered ? (
              isCorrect ? (
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle
                    size={22}
                    weight="fill"
                    className="text-emerald-600 sm:hidden"
                  />
                  <CheckCircle
                    size={28}
                    weight="fill"
                    className="text-emerald-600 hidden sm:block"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle
                    size={22}
                    weight="fill"
                    className="text-red-500 sm:hidden"
                  />
                  <XCircle
                    size={28}
                    weight="fill"
                    className="text-red-500 hidden sm:block"
                  />
                </div>
              )
            ) : null}
          </div>

          {/* CENTER */}
          <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-slate-800 text-xl sm:text-3xl md:text-[2.2rem] leading-[1.35] font-black"
            >
              {item.prompt}
            </motion.p>
          </div>

          {/* BUTTONS */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            <button
              disabled={isAnimating}
              onClick={() => onAnswer(item.id, "left")}
              className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-red-50 border border-red-100 py-4 sm:py-6 font-black text-red-500 shadow-lg transition active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-100/0 to-red-100 opacity-0 group-hover:opacity-100 transition" />

              <div className="relative flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-lg">
                <ArrowLeft size={18} weight="bold" className="sm:hidden" />
                <ArrowLeft
                  size={24}
                  weight="bold"
                  className="hidden sm:block"
                />
                {item.left_label}
              </div>
            </button>

            <button
              disabled={isAnimating}
              onClick={() => onAnswer(item.id, "right")}
              className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-emerald-50 border border-emerald-100 py-4 sm:py-6 font-black text-emerald-600 shadow-lg transition active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/0 to-emerald-100 opacity-0 group-hover:opacity-100 transition" />

              <div className="relative flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-lg">
                {item.right_label}
                <ArrowRight size={18} weight="bold" className="sm:hidden" />
                <ArrowRight
                  size={24}
                  weight="bold"
                  className="hidden sm:block"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
