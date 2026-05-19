import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Lightning } from "@phosphor-icons/react";
import FloatingFeedback from "./FloatingFeedback";
import { Howl } from "howler";

const correctSound = new Howl({ src: ["/sounds/correct.mp3"] });
const incorrectSound = new Howl({ src: ["/sounds/incorrect.mp3"] });

export default function MatchPairsActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
  maxScore,
  maxXp,
}) {
  const [pairs, setPairs] = useState([]); // array de {conceptId, definitionId, correct}
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [attempts, setAttempts] = useState({});
  const [errorPair, setErrorPair] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const completedRef = useRef(false);

  // Mezclar definiciones para mostrar orden aleatorio
  const shuffledDefinitions = useRef([]);
  useEffect(() => {
    const allDefs = items.flatMap((item) => item.options.definitions);
    // Fisher-Yates shuffle
    for (let i = allDefs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allDefs[i], allDefs[j]] = [allDefs[j], allDefs[i]];
    }
    shuffledDefinitions.current = allDefs;
  }, [items]);

  // Cargar respuestas previas
  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      const answered = initialAnswers.map((a) => ({
        conceptId: a.questionId,
        definitionId: a.userAnswer,
        correct: a.correct,
        points: a.pointsAwarded,
        xp: a.xpAwarded,
      }));
      setPairs(answered);
      // Marcar intentos para cada concepto respondido
      const atts = {};
      answered.forEach((a) => {
        atts[a.conceptId] = 1; // asumimos un intento previo
      });
      setAttempts(atts);
    }
  }, [initialAnswers]);

  const handleConceptClick = useCallback(
    (conceptId) => {
      if (pairs.some((p) => p.conceptId === conceptId)) return;
      setSelectedConcept((prev) => (prev === conceptId ? null : conceptId));
    },
    [pairs],
  );

  const handleDefinitionClick = useCallback(
    async (definitionId) => {
      if (!selectedConcept || submitting) return;
      const conceptId = selectedConcept;
      setSelectedConcept(null); // deseleccionar

      const item = items.find((i) => i.id === conceptId);
      if (!item) return;

      const isCorrect = item.correctAnswer === definitionId;
      const attemptCount = (attempts[conceptId] || 0) + 1;
      setAttempts((prev) => ({ ...prev, [conceptId]: attemptCount }));

      let points = 0;
      let xp = 0;
      if (isCorrect) {
        if (attemptCount === 1) {
          points = item.scoreReward;
          xp = item.xpReward;
        }
        correctSound.play();
      } else {
        incorrectSound.play();
      }

      const newPair = {
        conceptId,
        definitionId,
        correct: isCorrect,
        points,
        xp,
      };
      setPairs((prev) => [...prev, newPair]);
      setFeedback({ conceptId, correct: isCorrect, xp, points });

      if (!isCorrect) {
        setErrorPair(conceptId);
        setTimeout(() => setErrorPair(null), 2000);
      }

      setSubmitting(true);
      try {
        await onSubmitAnswer(activityId, conceptId, definitionId);
      } catch (err) {
        console.error("Error al enviar respuesta:", err);
      }
      setSubmitting(false);

      // Verificar finalización
      if (pairs.length + 1 === items.length) {
        const totalScore = [...pairs, newPair].reduce(
          (s, p) => s + p.points,
          0,
        );
        const totalXp = [...pairs, newPair].reduce((s, p) => s + p.xp, 0);
        onActivityComplete(totalScore, totalXp);
      }
    },
    [
      selectedConcept,
      submitting,
      attempts,
      items,
      activityId,
      onSubmitAnswer,
      pairs,
      onActivityComplete,
    ],
  );

  return (
    <div className="p-4 md:py-8 md:px-60">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna de conceptos */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Conceptos
            </h3>
            <div className="space-y-2">
              {items.map((item) => {
                const paired = pairs.find((p) => p.conceptId === item.id);
                const isSelected = selectedConcept === item.id;
                const isError = errorPair === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleConceptClick(item.id)}
                    disabled={!!paired || submitting}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      paired
                        ? paired.correct
                          ? "border-emerald-400 bg-emerald-50 cursor-default"
                          : "border-rose-400 bg-rose-50 cursor-default"
                        : isSelected
                          ? "border-blue-400 bg-blue-50 ring-2 ring-blue-300"
                          : "border-slate-200 bg-white hover:border-blue-300 cursor-pointer"
                    } ${isError ? "animate-pulse border-rose-500" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.prompt}</span>
                      {paired?.correct && (
                        <CheckCircle size={20} className="text-emerald-500" />
                      )}
                      {paired && !paired.correct && (
                        <XCircle size={20} className="text-rose-500" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Columna de definiciones */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Definiciones
            </h3>
            <div className="space-y-2">
              {shuffledDefinitions.current
                .filter((def) => !pairs.some((p) => p.definitionId === def.id))
                .map((def) => {
                  const isDisabled =
                    pairs.some((p) => p.definitionId === def.id) ||
                    submitting ||
                    !selectedConcept;
                  return (
                    <motion.button
                      key={def.id}
                      onClick={() => handleDefinitionClick(def.id)}
                      disabled={isDisabled}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isDisabled
                          ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer"
                      }`}
                    >
                      <span className="font-medium">{def.text}</span>
                    </motion.button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Floating feedback */}
        <FloatingFeedback
          show={!!feedback}
          correct={feedback?.correct}
          xp={feedback?.xp}
        />
      </div>
    </div>
  );
}
