import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  XCircle,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import { playSound } from "../../../utils/soundManager";

/* ---------- Token Draggable ---------- */
function Token({ token, disabled, used }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: token.id,
      data: { token },
      disabled: disabled || used,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    touchAction: "none",
    opacity: used ? 0.4 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: used ? 0.4 : 1, y: 0 }}
      {...listeners}
      {...attributes}
      className={`
        px-3 py-2 rounded-xl border text-sm font-medium shadow-sm select-none
        ${
          used
            ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
            : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 cursor-grab active:cursor-grabbing"
        }
        ${isDragging ? "ring-2 ring-blue-400" : ""}
      `}
    >
      {token.text}
    </motion.div>
  );
}

/* ---------- Slot Droppable ---------- */
function Slot({
  slotId,
  label,
  acceptedType,
  filledToken,
  onRemove,
  evaluated,
  isCorrect,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: { acceptedType },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed transition-all min-w-[140px]
        ${isOver ? "border-blue-400 bg-blue-50 scale-105" : "border-slate-300 bg-white/70"}
        ${
          filledToken
            ? evaluated
              ? isCorrect
                ? "border-emerald-500 bg-emerald-50"
                : "border-red-500 bg-red-50"
              : "border-solid border-blue-500 bg-blue-50"
            : ""
        }
      `}
    >
      <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
        {label}
      </span>
      {filledToken ? (
        <div className="flex items-center gap-1 flex-1">
          <span className="text-sm font-medium text-slate-800">
            {filledToken.text}
          </span>
          {!evaluated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-slate-400 hover:text-red-500"
              aria-label="Quitar token"
            >
              <XCircle size={18} weight="fill" />
            </button>
          )}
          {evaluated && (
            <span className="ml-auto">
              {isCorrect ? (
                <CheckCircle
                  size={20}
                  weight="fill"
                  className="text-emerald-500"
                />
              ) : (
                <XCircle size={20} weight="fill" className="text-red-500" />
              )}
            </span>
          )}
        </div>
      ) : (
        <span className="text-sm text-slate-400 italic">Arrastra aquí</span>
      )}
    </div>
  );
}

/* ---------- Historia individual ---------- */
function StoryBuilder({
  story,
  initialSlots,
  onSubmit,
  evaluated,
  onSlotChange,
}) {
  const [slots, setSlots] = useState(initialSlots || {}); // { slotId: token }
  const [activeToken, setActiveToken] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  const tokens = useMemo(() => story.tokens, [story]);

  // Determinar si la historia está completa
  const allFilled = story.template.slots.every((s) => !!slots[s.id]);
  const isStoryComplete = allFilled && evaluated;

  // Efecto para enviar respuesta automáticamente cuando se llenen los tres slots
  useEffect(() => {
    if (!evaluated && allFilled) {
      const answer = {};
      story.template.slots.forEach((slot) => {
        const slotKey = `slot_${slot.id}`;
        answer[slotKey] = slots[slot.id]?.id || null;
      });
      onSubmit(story.id, answer);
    }
  }, [allFilled, evaluated, slots, story.id, story.template.slots, onSubmit]);

  const handleDragStart = (event) => {
    setActiveToken(tokens.find((t) => t.id === event.active.id));
  };

  const handleDragEnd = (event) => {
    setActiveToken(null);
    const { active, over } = event;
    if (!over) return;

    const token = tokens.find((t) => t.id === active.id);
    const slotId = over.id;
    const slotDef = story.template.slots.find((s) => s.id === slotId);
    if (!slotDef || !token) return;

    // Validar tipo
    if (token.type !== slotDef.id) return; // ignorar drop incorrecto

    // Si el slot ya está ocupado, no hacer nada
    if (slots[slotId]) return;

    // Asignar token al slot
    const newSlots = { ...slots, [slotId]: token };
    setSlots(newSlots);
    onSlotChange(story.id, newSlots);
  };

  const handleRemoveToken = (slotId) => {
    const newSlots = { ...slots };
    delete newSlots[slotId];
    setSlots(newSlots);
    onSlotChange(story.id, newSlots);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white/80 backdrop-blur rounded-3xl border border-slate-200 shadow-sm p-6">
        {/* Plantilla */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-8">
          {story.template.slots.map((slot) => {
            const token = slots[slot.id];
            const correctTokenId = story.correctAnswers?.[`slot_${slot.id}`];
            const isCorrect = evaluated && token?.id === correctTokenId;
            return (
              <Slot
                key={slot.id}
                slotId={slot.id}
                label={slot.label}
                acceptedType={slot.id}
                filledToken={token}
                onRemove={() => handleRemoveToken(slot.id)}
                evaluated={evaluated}
                isCorrect={isCorrect}
              />
            );
          })}
        </div>

        {/* Tokens disponibles */}
        <div>
          <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">
            Tokens disponibles
          </h4>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {tokens.map((token) => {
                const isUsed = Object.values(slots).some(
                  (t) => t.id === token.id,
                );
                return (
                  <Token
                    key={token.id}
                    token={token}
                    disabled={evaluated}
                    used={isUsed}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeToken ? (
          <div className="w-fit pointer-events-none">
            <Token token={activeToken} disabled={false} used={false} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/* ---------- Componente principal ---------- */
export default function UserStoryBuilderActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slotAssignments, setSlotAssignments] = useState({}); // { storyId: { slotId: token } }
  const [evaluatedStories, setEvaluatedStories] = useState({}); // { storyId: true }
  const [activityCompleted, setActivityCompleted] = useState(false);

  const stories = items;
  const currentStory = stories[currentIndex];

  // Cargar respuestas previas
  useEffect(() => {
    if (initialAnswers?.length > 0) {
      const assignments = {};
      const evaluated = {};
      initialAnswers.forEach((ans) => {
        // ans.questionId = story.id, ans.userAnswer = { slot_rol: tokenId, ... }
        if (ans.userAnswer && typeof ans.userAnswer === "object") {
          const storyTokens = {};
          const storySlots = stories.find((s) => s.id === ans.questionId)
            ?.template.slots;
          if (storySlots) {
            storySlots.forEach((slot) => {
              const tokenId = ans.userAnswer[`slot_${slot.id}`];
              if (tokenId) {
                const token = stories
                  .find((s) => s.id === ans.questionId)
                  ?.tokens.find((t) => t.id === tokenId);
                if (token) storyTokens[slot.id] = token;
              }
            });
          }
          assignments[ans.questionId] = storyTokens;
          if (ans.correct !== undefined) {
            evaluated[ans.questionId] = true; // ya fue evaluada
          }
        }
      });
      setSlotAssignments(assignments);
      setEvaluatedStories(evaluated);

      // Encontrar la primera historia no completada
      const firstUnanswered = stories.findIndex(
        (s) =>
          !evaluated[s.id] ||
          !Object.keys(assignments[s.id] || {}).length === 3,
      );
      setCurrentIndex(firstUnanswered !== -1 ? firstUnanswered : 0);
    }
  }, [initialAnswers, stories]);

  // Calcular puntuación total cuando todas las historias están evaluadas
  useEffect(() => {
    if (!activityCompleted && stories.length > 0) {
      const allEvaluated = stories.every((s) => evaluatedStories[s.id]);
      if (allEvaluated) {
        setActivityCompleted(true);
        // Calcular puntuación
        let totalScore = 0;
        let totalXp = 0;
        stories.forEach((story) => {
          const slots = slotAssignments[story.id] || {};
          const correct = story.correctAnswers;
          let storyCorrect = true;
          if (correct) {
            story.template.slots.forEach((slot) => {
              const correctToken = correct[`slot_${slot.id}`];
              if (slots[slot.id]?.id !== correctToken) storyCorrect = false;
            });
          } else {
            storyCorrect = false;
          }
          if (storyCorrect) {
            totalScore += story.scoreReward || 0;
            totalXp += story.xpReward || 0;
          }
        });
        onActivityComplete(totalScore, totalXp);
      }
    }
  }, [
    evaluatedStories,
    slotAssignments,
    stories,
    activityCompleted,
    onActivityComplete,
  ]);

  const handleSubmitStory = useCallback(
    async (storyId, answer) => {
      try {
        await onSubmitAnswer(activityId, storyId, answer);
      } catch (err) {
        console.error("Error enviando respuesta:", err);
      }
    },
    [activityId, onSubmitAnswer],
  );

  const handleSlotChange = (storyId, slots) => {
    setSlotAssignments((prev) => ({ ...prev, [storyId]: slots }));
    // Si los tres slots están llenos, evaluamos automáticamente
    const story = stories.find((s) => s.id === storyId);
    if (story && story.template.slots.every((slot) => slots[slot.id])) {
      // Marcar como evaluada
      setEvaluatedStories((prev) => ({ ...prev, [storyId]: true }));
      playSound("correct"); // sonido genérico al completar una historia
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const isCurrentEvaluated = !!evaluatedStories[currentStory?.id];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-center text-xl md:text-3xl font-black text-slate-800 mb-2">
        Construye las user stories
      </h2>
      <p className="text-center text-slate-500 mb-8 text-sm md:text-base">
        Arrastra los tokens a los espacios correspondientes para formar la
        historia completa.
      </p>

      {/* Navegación entre historias */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
          aria-label="Historia anterior"
        >
          <CaretLeft size={24} />
        </button>
        <span className="font-semibold text-slate-600">
          {currentIndex + 1} / {stories.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex === stories.length - 1}
          className="p-2 rounded-full bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-100 cursor-pointer"
          aria-label="Siguiente historia"
        >
          <CaretRight size={24} />
        </button>
      </div>

      {/* Historia actual */}
      {currentStory && (
        <StoryBuilder
          key={currentStory.id}
          story={currentStory}
          initialSlots={slotAssignments[currentStory.id] || {}}
          onSubmit={handleSubmitStory}
          evaluated={isCurrentEvaluated}
          onSlotChange={handleSlotChange}
        />
      )}

      {/* Indicador de completitud */}
      <div className="flex justify-center mt-6 gap-2">
        {stories.map((story, idx) => {
          const isDone = !!evaluatedStories[story.id];
          return (
            <div
              key={story.id}
              className={`w-3 h-3 rounded-full ${
                isDone ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
          );
        })}
      </div>

      {activityCompleted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-emerald-600 font-semibold"
        >
          ¡Todas las historias completadas!
        </motion.p>
      )}
    </div>
  );
}
