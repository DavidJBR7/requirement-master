import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lightning } from "@phosphor-icons/react";

import GarciaAvatar from "../../../shared/components/GarciaAvatar";
import TypingMessage from "../../../shared/components/TypingMessage";

const CONTEXT_MESSAGE =
  "El señor García llega a tu oficina buscando ayuda para comprender mejor algunos conceptos relacionados con requerimientos de software.";

const THINKING_DELAY = 3000;

export default function ChatbotSimulationActivity({
  activityId,
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
}) {
  // ------------------------------------------------------------------
  // 1. Cálculos iniciales a partir de initialAnswers
  // ------------------------------------------------------------------
  const initialLoadDone = useRef(false);

  const maxConfidence = useMemo(
    () => items.reduce((sum, item) => sum + (item.scoreReward || 0), 0),
    [items],
  );

  const initialData = useMemo(() => {
    if (!initialAnswers || initialAnswers.length === 0) {
      return {
        initialChatHistory: null,
        initialPoints: 0,
        firstUnansweredIdx: 0,
        lastAvatarMood: "neutral",
      };
    }

    const answeredMap = {};
    initialAnswers.forEach((a) => {
      answeredMap[a.questionId] = a.userAnswer;
    });

    let points = 0;
    const history = [{ id: "context", type: "context", text: CONTEXT_MESSAGE }];
    let firstUnansweredIdx = items.length;
    let lastMood = "neutral";

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const answerId = answeredMap[item.id];

      // Si no hay respuesta para esta ronda, es la primera sin responder
      if (!answerId) {
        firstUnansweredIdx = Math.min(firstUnansweredIdx, i);
        break; // No agregamos más mensajes de rondas futuras
      }

      // Agregar mensaje del NPC (Sr. García)
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

        // Determinar el mood basado en el multiplicador
        const mood = multiplier >= 0.8 ? "happy" : "confused";
        lastMood = mood;

        // No agregamos mensaje de reacción textual, solo guardamos el mood
        // que se mostrará en el avatar al cargar
      }
    }

    return {
      initialChatHistory: history,
      initialPoints: points,
      firstUnansweredIdx,
      lastAvatarMood: lastMood,
    };
  }, [items, initialAnswers]);

  // ------------------------------------------------------------------
  // 2. Estados principales
  // ------------------------------------------------------------------
  const [currentRound, setCurrentRound] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [confidencePoints, setConfidencePoints] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

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
      setChatHistory(initialData.initialChatHistory);
      setConfidencePoints(initialData.initialPoints);
      setAvatarMood(initialData.lastAvatarMood);

      const idx = initialData.firstUnansweredIdx;
      if (idx >= items.length) {
        // Todas las rondas ya fueron respondidas
        setCompleted(true);
        setConversationStarted(true);
        onActivityComplete?.();
      } else {
        setCurrentRound(idx);
        // Si hay historial, la conversación ya comenzó
        setConversationStarted(true);
        // No mostramos opciones hasta que termine la escritura del NPC actual
        setShowOptions(false);
        setTypingFinished(false);
        // Forzar que se inicie la escritura del NPC de la ronda actual
        // Esto se manejará en el useEffect que observa currentRound
      }
    } else {
      // Sin respuestas previas → empezar desde cero, solo contexto
      setChatHistory([
        { id: "context", type: "context", text: CONTEXT_MESSAGE },
      ]);
      setConfidencePoints(0);
      setCurrentRound(0);
      setConversationStarted(false);
      setCompleted(false);
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
  // 5. Iniciar la conversación (cuando el usuario hace clic en "Continuar")
  // ------------------------------------------------------------------
  const handleStartConversation = () => {
    setConversationStarted(true);
    // Forzar reinicio de la escritura para la ronda actual (round 0)
    setTypingFinished(false);
    setShowOptions(false);
    setAvatarTalking(true);
  };

  // ------------------------------------------------------------------
  // 6. Item actual
  // ------------------------------------------------------------------
  const currentItem = items[currentRound];

  // ------------------------------------------------------------------
  // 7. Iniciar ronda (efecto de escritura)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!currentItem || completed || !conversationStarted) return;
    if (!initialLoadDone.current) return;

    // Si esta ronda ya tiene respuesta de usuario, no hacer nada
    const alreadyAnswered = chatHistory.some(
      (m) => m.id === `user-${currentItem.id}`,
    );
    if (alreadyAnswered) return;

    // Asegurar que el mensaje del NPC exista (por si no se agregó en el historial inicial)
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
    // Resetear mood a neutral al empezar una nueva ronda (se cambiará después de responder)
    setAvatarMood("neutral");
  }, [currentRound, currentItem, completed, conversationStarted, chatHistory]);

  // ------------------------------------------------------------------
  // 8. Callback cuando termina la escritura del mensaje actual
  // ------------------------------------------------------------------
  const handleTypingFinished = () => {
    setAvatarTalking(false);
    setTypingFinished(true);
    setShowOptions(true);
  };

  // ------------------------------------------------------------------
  // 9. Selección de una opción de respuesta
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
      const earned = Math.round(currentItem.scoreReward * multiplier);
      setConfidencePoints((prev) => prev + earned);

      // Cambiar el mood del avatar según la calidad de la respuesta (sin mensaje textual)
      const mood = multiplier >= 0.8 ? "happy" : "confused";
      setAvatarMood(mood);

      // No agregamos ningún mensaje de reacción al historial
      // Solo el avatar cambiará su expresión
    }, THINKING_DELAY);
  };

  // ------------------------------------------------------------------
  // 10. Pasar a la siguiente ronda o finalizar
  // ------------------------------------------------------------------
  const handleNext = () => {
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
  // 11. Porcentaje y color de la barra de confianza
  // ------------------------------------------------------------------
  const confidencePercentage = useMemo(
    () => (confidencePoints / maxConfidence) * 100,
    [confidencePoints, maxConfidence],
  );

  const barColor = useMemo(() => {
    if (confidencePercentage >= 70) return "from-green-500 to-emerald-400";
    if (confidencePercentage >= 40) return "from-yellow-500 to-orange-400";
    return "from-red-500 to-rose-400";
  }, [confidencePercentage]);

  // ------------------------------------------------------------------
  // 12. Renderizado
  // ------------------------------------------------------------------
  return (
    <div className="flex flex-col h-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
      {/* HEADER con barra de confianza */}
      <div className="bg-white border-b border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Confianza del cliente
          </span>
          <span className="text-sm font-bold text-slate-700">
            {confidencePoints} / {maxConfidence}
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

      {/* CHAT - con scroll interno */}
      <div className="flex-1 overflow-y-auto p-5 space-y-10">
        {chatHistory.map((msg) => {
          // CONTEXTO
          if (msg.type === "context") {
            return (
              <div
                key={msg.id}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900"
              >
                {msg.text}
              </div>
            );
          }

          // NPC (Sr. García)
          if (msg.type === "npc") {
            const isCurrent = msg.id === currentItem?.id;
            const isBeingTyped =
              isCurrent && !typingFinished && conversationStarted;

            return (
              <div key={msg.id} className="space-y-4">
                {isBeingTyped ? (
                  <TypingMessage
                    text={msg.text}
                    active={isBeingTyped}
                    onFinished={handleTypingFinished}
                  />
                ) : (
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm whitespace-pre-wrap">
                    {msg.text}
                  </div>
                )}

                <div className="flex justify-center">
                  <GarciaAvatar
                    mood={isCurrent ? avatarMood : msg.mood || "neutral"}
                    talking={isCurrent && avatarTalking}
                  />
                </div>
              </div>
            );
          }

          // USUARIO
          if (msg.type === "user") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm text-white shadow-md">
                  {msg.text}
                </div>
              </div>
            );
          }

          // REACCIÓN (ya no se usa, pero se conserva por compatibilidad si existiera)
          return null;
        })}

        {/* INDICADOR DE "PENSANDO" */}
        {thinking && (
          <div className="space-y-4">
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
            <div className="flex justify-center">
              <GarciaAvatar mood="neutral" talking />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* BOTÓN INICIAL "CONTINUAR" (solo si no se ha iniciado la conversación y no está completado) */}
      {!conversationStarted && !completed && (
        <div className="border-t border-slate-200 bg-white p-4 flex justify-center">
          <button
            onClick={handleStartConversation}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg"
          >
            Continuar
            <Lightning size={18} weight="fill" />
          </button>
        </div>
      )}

      {/* OPCIONES DE RESPUESTA */}
      {conversationStarted && !completed && showOptions && (
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

      {/* BOTÓN SIGUIENTE/FINALIZAR */}
      {conversationStarted &&
        !completed &&
        !thinking &&
        selectedOption &&
        !showOptions && (
          <div className="border-t border-slate-200 bg-white p-4 flex justify-center">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg"
            >
              {currentRound < items.length - 1 ? "Continuar" : "Finalizar"}
              <Lightning size={18} weight="fill" />
            </button>
          </div>
        )}
    </div>
  );
}
