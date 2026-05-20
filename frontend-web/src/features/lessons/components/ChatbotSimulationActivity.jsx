import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lightning } from "@phosphor-icons/react";

import GarciaAvatar from "../../../shared/components/GarciaAvatar";
import TypingMessage from "../../../shared/components/TypingMessage";

const CONTEXT_MESSAGE =
  "El señor García llega a tu oficina buscando ayuda para comprender mejor algunos conceptos relacionados con requerimientos de software.";

const THINKING_DELAY = 3000;

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

        // Reacción con el feedback correspondiente
        const mood = option.avatarExpression || "neutral";
        const feedbackText = getFeedbackMessage(answerId, multiplier, item);

        history.push({
          id: `reaction-${item.id}`,
          type: "reaction",
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

  // ------------------------------------------------------------------
  // 3. Inicialización única al montar
  // ------------------------------------------------------------------
  useEffect(() => {
    if (initialLoadDone.current) return;

    if (initialData.initialChatHistory) {
      // Hay respuestas previas: se considera ya iniciada
      setChatHistory(initialData.initialChatHistory);
      setConfidencePoints(initialData.initialPoints);
      setHasStarted(true); // <-- arranca directamente

      const idx = initialData.firstUnansweredIdx;
      if (idx >= items.length) {
        setCompleted(true);
        onActivityComplete?.();
      } else {
        setCurrentRound(idx);
      }
    } else {
      // Sin respuestas: solo contexto, no iniciada
      setChatHistory([
        { id: "context", type: "context", text: CONTEXT_MESSAGE },
      ]);
      setConfidencePoints(0);
      setHasStarted(false); // <-- se necesita pulsar "Continuar"
      // currentRound se mantiene en 0, pero no se usará hasta que hasStarted sea true
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
    setTimeout(() => {
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

      // Reacción: avatar con expresión y texto de feedback
      setChatHistory((prev) => [
        ...prev,
        {
          id: `reaction-${currentItem.id}`,
          type: "reaction",
          mood,
          text: feedbackMessage,
        },
      ]);
    }, THINKING_DELAY);

    // ------------------------------------------------------------------
    // 9. Pasar a la siguiente ronda o finalizar
    // ------------------------------------------------------------------
    setAvatarMood("neutral");
    setSelectedOption(null);

    if (currentRound < items.length - 1) {
      setCurrentRound((prev) => prev + 1);
    } else {
      setCompleted(true);
      onActivityComplete?.();
    }
  };

  // ------------------------------------------------------------------
  // 10. Porcentaje y color de la barra de confianza
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
  // 11. Manejador del botón "Continuar"
  // ------------------------------------------------------------------
  const handleStartConversation = () => {
    setHasStarted(true);
    // Forzamos la primera ronda, que añadirá el mensaje del NPC y comenzará a escribir
    setCurrentRound(0);
  };

  // ------------------------------------------------------------------
  // 12. Renderizado
  // ------------------------------------------------------------------
  return (
    <div className="flex justify-center">
      <div className="flex flex-col h-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 max-w-xl">
        {/* HEADER con barra de confianza + mini avatar */}
        <div className="bg-white border-b border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            {/* Mini avatar a la izquierda de la barra */}
            <div className="w-10 h-10 flex-shrink-0">
              <GarciaAvatar mood={confidenceMood} talking={avatarTalking} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Confianza del cliente
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {confidencePercentage}%
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden">
                <motion.div
                  animate={{ width: `${confidencePercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full bg-gradient-to-r ${barColor}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {chatHistory.map((msg) => {
            // CONTEXTO
            if (msg.type === "context") {
              return (
                <div key={msg.id}>
                  <div className="bg-blue-100 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
                    {msg.text}
                  </div>
                  {/* Botón "Continuar" si la conversación aún no ha empezado */}
                  {!hasStarted && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={handleStartConversation}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                      >
                        Continuar
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            // NPC (Sr. García) – avatar a la izquierda, burbuja de texto a la derecha
            if (msg.type === "npc") {
              const isCurrent = msg.id === currentItem?.id;
              const isBeingTyped = isCurrent && !typingFinished;

              return (
                <div key={msg.id} className="flex items-center gap-3">
                  {/* Avatar del NPC */}
                  <div className="w-14 flex-shrink-0">
                    <GarciaAvatar
                      mood={isCurrent ? avatarMood : "neutral"}
                      talking={isCurrent && avatarTalking}
                      size="sm"
                    />
                  </div>
                  {/* Burbuja de texto */}
                  <div className="max-w-[50%]">
                    {isBeingTyped ? (
                      <TypingMessage
                        text={msg.text}
                        active={isBeingTyped}
                        onFinished={handleTypingFinished}
                      />
                    ) : (
                      <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // USUARIO – alineado a la derecha
            if (msg.type === "user") {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[50%] rounded-2xl rounded-br-md bg-brand-gradient px-4 py-3 text-sm text-white shadow-md">
                    {msg.text}
                  </div>
                </div>
              );
            }

            // REACCIÓN
            if (msg.type === "reaction") {
              const getReactionStyles = () => {
                switch (msg.mood) {
                  case "approved":
                    return "border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-100";
                  case "maybe":
                    return "border-amber-300 bg-amber-50 shadow-lg shadow-amber-100";
                  case "confused":
                    return "border-orange-300 bg-orange-50 shadow-lg shadow-orange-100";
                  case "incorrect":
                    return "border-red-300 bg-red-50 shadow-lg shadow-red-100";
                  default:
                    return "border-slate-200 bg-white shadow-sm";
                }
              };

              return (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-14 flex-shrink-0">
                    <GarciaAvatar mood={msg.mood} size="sm" />
                  </div>
                  {/* Burbuja con mensaje de retroalimentación con estilo dinámico */}
                  <div
                    className={`rounded-2xl rounded-bl-md border px-4 py-3 ${getReactionStyles()}`}
                  >
                    <p className="text-sm text-slate-700">{msg.text}</p>
                  </div>
                </div>
              );
            }

            return null;
          })}

          {/* INDICADOR DE "PENSANDO" */}
          {thinking && (
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <GarciaAvatar mood="neutral" talking />
              </div>
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
        </div>

        {/* OPCIONES DE RESPUESTA */}
        {!completed && showOptions && (
          <div className="border-t border-slate-200 bg-white p-4 space-y-3">
            {currentItem.options.map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectOption(opt.id)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50"
              >
                {opt.text}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
