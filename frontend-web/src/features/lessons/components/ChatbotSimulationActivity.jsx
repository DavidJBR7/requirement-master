import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lightning } from "@phosphor-icons/react";
import Button from "../../../shared/components/Button";
import GarciaAvatar from "../../../shared/components/GarciaAvatar";
import TypingMessage from "../../../shared/components/TypingMessage";

const CONTEXT_MESSAGE =
  "El señor García llega a tu oficina buscando ayuda para comprender mejor algunos conceptos relacionados con requerimientos de software.";

const THINKING_DELAY = 3000;
const PAUSE_DELAY = 3000; // Pausa para leer la retroalimentación antes de la siguiente pregunta

// ------------------------------------------------------------------
// Función auxiliar para generar el mensaje de retroalimentación
// ------------------------------------------------------------------
const getFeedbackMessage = (selectedOptionId, multiplier, currentItem) => {
  const bestOption = currentItem.options.find(
    (opt) => opt.id === currentItem.bestOption,
  );

  // Caso 1: Es la mejor opción (multiplier = 1)
  if (multiplier === 1 && selectedOptionId === currentItem.bestOption) {
    const messages = [
      "Excelente elección. Esa es la respuesta más acertada.",
      "Muy bien. Esa es la mejor opción.",
      "Perfecto. Has seleccionado la respuesta correcta.",
      "Gran elección. Esa es la opción más adecuada.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Caso 2: Buena opción pero no la mejor (multiplier entre 0.6 y 0.9)
  if (multiplier >= 0.6 && multiplier < 1) {
    const messages = [
      `Buena opción, pero la más acertada era: "${bestOption?.text}"`,
      `Es una buena respuesta, sin embargo, la mejor opción era: "${bestOption?.text}"`,
      `Bien encaminado. Aunque la respuesta más acertada era: "${bestOption?.text}"`,
      `Correcto, pero podrías mejorar seleccionando: "${bestOption?.text}"`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Caso 3: Opción regular (multiplier entre 0.3 y 0.5)
  if (multiplier >= 0.3 && multiplier < 0.6) {
    const messages = [
      `Pueden haber mejores opciones. La más acertada era: "${bestOption?.text}"`,
      `Vamos por buen camino, pero la mejor respuesta es: "${bestOption?.text}"`,
      `Es una opción válida, aunque la más adecuada sería: "${bestOption?.text}"`,
      `Esta respuesta ayuda, pero lo más acertado es: "${bestOption?.text}"`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Caso 4: Mala opción (multiplier < 0.3)
  if (multiplier < 0.3) {
    const messages = [
      `No es la mejor opción. La respuesta más acertada es: "${bestOption?.text}"`,
      `Podrías reconsiderar. La mejor alternativa es: "${bestOption?.text}"`,
      `Quizás no sea la opción más adecuada. Sería mejor: "${bestOption?.text}"`,
      `Esta respuesta no es la ideal. La más acertada sería: "${bestOption?.text}"`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Mensaje por defecto
  return `La mejor opción es: "${bestOption?.text}"`;
};

export default function ChatbotSimulationActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
  maxScore,
}) {
  // ------------------------------------------------------------------
  // 1. Cálculos iniciales a partir de initialAnswers
  // ------------------------------------------------------------------
  const initialLoadDone = useRef(false);

  const maxConfidence =
    maxScore || items.reduce((sum, item) => sum + item.scoreReward, 0);

  const initialData = useMemo(() => {
    if (!initialAnswers || initialAnswers.length === 0) {
      return {
        initialChatHistory: null,
        initialPoints: 0,
        firstUnansweredIdx: 0,
      };
    }

    const answeredMap = {};
    initialAnswers.forEach((a) => {
      answeredMap[a.questionId] = a.userAnswer;
    });

    let points = 0;
    const history = [{ id: "context", type: "context", text: CONTEXT_MESSAGE }];
    let firstUnansweredIdx = items.length; // por defecto, todas respondidas

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const answerId = answeredMap[item.id];

      // Si no hay respuesta para esta ronda, detenemos la reconstrucción
      if (!answerId) {
        firstUnansweredIdx = Math.min(firstUnansweredIdx, i);
        break;
      }

      // Mensaje del NPC (Sr. García)
      history.push({
        id: item.id,
        type: "npc",
        text: item.message,
      });

      const option = item.options.find((o) => o.id === answerId);
      if (option) {
        const multiplier = option.scoreMultiplier || 0;
        const earned = Math.round(item.scoreReward * multiplier);
        points += earned;

        // Mensaje del usuario
        history.push({
          id: `user-${item.id}`,
          type: "user",
          text: option.text,
        });

        // Reacción con el feedback correspondiente (ahora como mensaje del NPC)
        const mood = option.avatarExpression || "neutral";
        const feedbackText = getFeedbackMessage(answerId, multiplier, item);

        history.push({
          id: `feedback-${item.id}`,
          type: "npc-feedback",
          mood,
          text: feedbackText,
        });
      }
    }

    return {
      initialChatHistory: history,
      initialPoints: points,
      firstUnansweredIdx,
    };
  }, [items, initialAnswers]);

  // ------------------------------------------------------------------
  // 2. Estados principales
  // ------------------------------------------------------------------
  const [currentRound, setCurrentRound] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [confidencePoints, setConfidencePoints] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [avatarMood, setAvatarMood] = useState("neutral");
  const [avatarTalking, setAvatarTalking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [typingFinished, setTypingFinished] = useState(false);

  const chatBottomRef = useRef(null);
  const pauseTimeoutRef = useRef(null); // para limpiar el timeout de pausa
  const thinkingTimeoutRef = useRef(null); // para limpiar el timeout de pensamiento

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
    };
  }, []);

  // ------------------------------------------------------------------
  // 3. Inicialización única al montar
  // ------------------------------------------------------------------
  useEffect(() => {
    if (initialLoadDone.current) return;

    if (initialData.initialChatHistory) {
      // Hay respuestas previas: se considera ya iniciada
      setChatHistory(initialData.initialChatHistory);
      setConfidencePoints(initialData.initialPoints);
      setHasStarted(true);

      const idx = initialData.firstUnansweredIdx;
      if (idx >= items.length) {
        setCompleted(true);
        onActivityComplete?.();
      } else {
        setCurrentRound(idx);
      }
    } else {
      // Sin respuestas: inicio limpio (sin contexto en el chat)
      setChatHistory([
        { id: "context", type: "context", text: CONTEXT_MESSAGE },
      ]);
      setConfidencePoints(0);
      setHasStarted(false);
    }

    initialLoadDone.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------------------------------------------------
  // 4. Scroll automático
  // ------------------------------------------------------------------
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, showOptions, thinking]);

  // ------------------------------------------------------------------
  // 5. Item actual
  // ------------------------------------------------------------------
  const currentItem = items[currentRound];

  // ------------------------------------------------------------------
  // 6. Iniciar ronda (efecto de escritura)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!currentItem || completed || !initialLoadDone.current || !hasStarted)
      return;

    // Si esta ronda ya tiene respuesta de usuario, no hacer nada
    const alreadyAnswered = chatHistory.some(
      (m) => m.id === `user-${currentItem.id}`,
    );
    if (alreadyAnswered) return;

    // Asegurar que el mensaje del NPC exista
    setChatHistory((prev) => {
      if (!prev.some((m) => m.id === currentItem.id)) {
        return [
          ...prev,
          { id: currentItem.id, type: "npc", text: currentItem.message },
        ];
      }
      return prev;
    });

    // Activar escritura
    setAvatarTalking(true);
    setTypingFinished(false);
    setShowOptions(false);
  }, [currentRound, currentItem, completed, chatHistory, hasStarted]);

  // ------------------------------------------------------------------
  // 7. Callback cuando termina la escritura del mensaje actual
  // ------------------------------------------------------------------
  const handleTypingFinished = () => {
    setAvatarTalking(false);
    setTypingFinished(true);
    setShowOptions(true);
  };

  // ------------------------------------------------------------------
  // 8. Selección de una opción de respuesta
  // ------------------------------------------------------------------
  const handleSelectOption = async (optionId) => {
    if (thinking) return;

    const option = currentItem.options.find((o) => o.id === optionId);
    if (!option) return;

    setSelectedOption(optionId);

    // Agregar mensaje del usuario
    setChatHistory((prev) => [
      ...prev,
      {
        id: `user-${currentItem.id}`,
        type: "user",
        text: option.text,
      },
    ]);

    setShowOptions(false);
    setThinking(true);

    // Enviar respuesta al backend
    try {
      await onSubmitAnswer(activityId, currentItem.id, optionId);
    } catch (error) {
      console.error("Error guardando respuesta:", error);
    }

    // Simular pensamiento del NPC antes de reaccionar
    thinkingTimeoutRef.current = setTimeout(() => {
      setThinking(false);

      const multiplier = option.scoreMultiplier || 0;
      const earned = Math.round(Number(currentItem.scoreReward) * multiplier);
      setConfidencePoints((prev) => prev + earned);

      const mood = option.avatarExpression || "neutral";
      setAvatarMood(mood);

      // Generar mensaje de retroalimentación
      const feedbackMessage = getFeedbackMessage(
        optionId,
        multiplier,
        currentItem,
      );

      // Agregar el mensaje de feedback como un nuevo mensaje del NPC
      setChatHistory((prev) => [
        ...prev,
        {
          id: `feedback-${currentItem.id}`,
          type: "npc-feedback",
          mood,
          text: feedbackMessage,
        },
      ]);

      // Pausa para lectura antes de la siguiente pregunta
      pauseTimeoutRef.current = setTimeout(() => {
        if (currentRound < items.length - 1) {
          setAvatarMood("neutral");
          setCurrentRound((prev) => prev + 1);
        } else {
          setCompleted(true);
          onActivityComplete?.();
        }
        // Limpiar la referencia del timeout
        pauseTimeoutRef.current = null;
      }, PAUSE_DELAY);
    }, THINKING_DELAY);
  };

  // ------------------------------------------------------------------
  // 9. Porcentaje y color de la barra de confianza
  // ------------------------------------------------------------------
  const confidencePercentage = useMemo(
    () => (confidencePoints / maxConfidence) * 100,
    [confidencePoints, maxConfidence],
  );

  const confidenceMood = useMemo(() => {
    if (confidencePercentage >= 70) return "neutral";
    if (confidencePercentage >= 45) return "approved";
    if (confidencePercentage >= 20) return "confused";
    return "incorrect";
  }, [confidencePercentage]);

  const barColor = useMemo(() => {
    if (confidencePercentage >= 70) return "from-green-500 to-emerald-400";
    if (confidencePercentage >= 45) return "from-yellow-500 to-orange-400";
    return "from-red-500 to-rose-400";
  }, [confidencePercentage]);

  // ------------------------------------------------------------------
  // 10. Manejador del botón "Continuar"
  // ------------------------------------------------------------------
  const handleStartConversation = () => {
    setHasStarted(true);
  };

  // ------------------------------------------------------------------
  // 11. Pantalla de bienvenida (cuando no ha comenzado)
  // ------------------------------------------------------------------
  if (!hasStarted) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col h-[80vh] rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 max-w-xl w-full">
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex flex-col items-center text-center gap-6">
                <GarciaAvatar mood="neutral" talking={false} />
                <p className="text-slate-700 text-lg leading-relaxed">
                  {CONTEXT_MESSAGE}
                </p>
                <Button
                  onClick={handleStartConversation}
                  className="px-8 py-4 !rounded-2xl bg-brand-gradient text-white font-bold shadow-lg"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 12. Renderizado del chat (actividad iniciada)
  // ------------------------------------------------------------------
  return (
    <div className="flex justify-center">
      <section
        className="flex flex-col h-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 max-w-xl"
        aria-label="Simulación de chat con el señor García"
      >
        {/* HEADER con barra de confianza + mini avatar */}
        <header className="bg-gradient-to-br from-blue-200/40 via-slate-100/60 to-blue-300/30 backdrop-blur-2xl bg-white/10 border-b border-blue-200/50 shadow-xl shadow-blue-500/10 px-5 py-3 sm:p-5">
          <div className="flex items-center gap-3 sm:mb-2">
            <figure className="w-10 sm:w-14 flex-shrink-0">
              <GarciaAvatar mood={confidenceMood} talking={avatarTalking} />
            </figure>
            <div className="flex-1">
              <div className="flex items-start justify-between sm:mb-1">
                <h2 className="text-xs sm:text-md font-bold uppercase tracking-wide text-slate-800">
                  Señor {items[0].avatar}
                </h2>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Confianza
                </span>
                <output
                  className="text-xs font-bold text-slate-700"
                  aria-label={`Nivel de confianza: ${confidencePercentage}%`}
                >
                  {confidencePercentage}%
                </output>
              </div>
              <div
                className="w-full h-2 sm:h-3 rounded-full bg-slate-200 overflow-hidden"
                role="progressbar"
                aria-valuenow={confidencePercentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Barra de progreso de confianza"
              >
                <motion.div
                  animate={{ width: `${confidencePercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full bg-gradient-to-r ${barColor}`}
                />
              </div>
            </div>
          </div>
        </header>

        {/* CHAT */}
        <main
          className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[40vh] sm:max-h-[45vh]"
          aria-label="Historial de conversación"
          role="log"
        >
          {chatHistory.map((msg) => {
            // CONTEXTO (solo cuando se recarga una actividad ya iniciada)
            if (msg.type === "context") {
              return (
                <article key={msg.id}>
                  <div className="bg-blue-100 border border-blue-200 rounded-2xl p-2 sm:p-4 text-xs sm:text-sm text-blue-900">
                    {msg.text}
                  </div>
                </article>
              );
            }

            // NPC (Sr. García) – pregunta actual
            if (msg.type === "npc") {
              const isCurrent = msg.id === currentItem?.id;
              const isBeingTyped = isCurrent && !typingFinished;

              return (
                <article
                  key={msg.id}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <figure className="w-10 sm:w-14 flex-shrink-0">
                    <GarciaAvatar
                      mood={isCurrent ? avatarMood : "neutral"}
                      talking={isCurrent && avatarTalking}
                      size="sm"
                    />
                  </figure>
                  <div className="max-w-[50%]">
                    {isBeingTyped ? (
                      <TypingMessage
                        text={msg.text}
                        active={isBeingTyped}
                        onFinished={handleTypingFinished}
                      />
                    ) : (
                      <blockquote className="rounded-2xl rounded-bl-xs border border-slate-200 bg-white px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-700 shadow-sm whitespace-pre-wrap">
                        {msg.text}
                      </blockquote>
                    )}
                  </div>
                </article>
              );
            }

            // USUARIO – alineado a la derecha
            if (msg.type === "user") {
              return (
                <article key={msg.id} className="flex justify-end">
                  <div className="max-w-[50%] rounded-2xl rounded-br-xs bg-brand-gradient px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-white shadow-md">
                    {msg.text}
                  </div>
                </article>
              );
            }

            // REACCIÓN
            if (msg.type === "npc-feedback") {
              const getReactionStyles = () => {
                switch (msg.mood) {
                  case "approved":
                    return "border-emerald-200 bg-emerald-50";

                  case "maybe":
                    return "border-amber-200 bg-amber-50";

                  case "confused":
                    return "border-orange-200 bg-orange-50";

                  case "incorrect":
                    return "border-red-200 bg-red-50";

                  default:
                    return "border-slate-200 bg-white";
                }
              };

              return (
                <motion.article
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <figure className="w-10 sm:w-14 flex-shrink-0">
                    <GarciaAvatar mood={msg.mood} size="sm" />
                  </figure>
                  {/* Burbuja con mensaje de retroalimentación con estilo dinámico */}
                  <div
                    className={`rounded-2xl rounded-bl-xs border px-3 py-2 sm:px-4 sm:py-3  ${getReactionStyles()}`}
                  >
                    <p className="text-xs sm:text-sm text-slate-700">
                      {msg.text}
                    </p>
                  </div>
                </motion.article>
              );
            }

            return null;
          })}

          {/* INDICADOR DE "PENSANDO" */}
          {thinking && (
            <div
              className="flex items-center gap-3"
              aria-live="polite"
              aria-label="El señor García está pensando"
            >
              <figure className="w-12 h-12 flex-shrink-0">
                <GarciaAvatar mood="neutral" talking={false} />
              </figure>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 inline-flex gap-1">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: dot * 0.15,
                    }}
                    className="w-2 h-2 rounded-full bg-slate-400"
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </main>

        {/* OPCIONES DE RESPUESTA */}
        {!completed && showOptions && (
          <nav
            className="border-t border-slate-200 bg-white p-4 space-y-3"
            aria-label="Opciones de respuesta"
          >
            {currentItem.options.map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectOption(opt.id)}
                className="w-full rounded-2xl border border-slate-200 bg-blue-50 p-2 sm:p-4 text-left text-xs sm:text-sm text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                type="button"
              >
                {opt.text}
              </motion.button>
            ))}
          </nav>
        )}
      </section>
    </div>
  );
}
