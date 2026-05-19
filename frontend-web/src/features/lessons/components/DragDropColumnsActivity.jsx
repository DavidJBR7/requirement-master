import { useState, useEffect, useCallback, useRef } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import FloatingFeedback from "./FloatingFeedback";
import { Howl } from "howler";

const correctSound = new Howl({ src: ["/sounds/correct.mp3"] });

function DraggableItem({ id, label, disabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, disabled });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : {};
  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`p-3 rounded-xl border-2 bg-white shadow-sm cursor-grab active:cursor-grabbing ${
        disabled
          ? "border-slate-200 opacity-50 cursor-not-allowed"
          : "border-blue-300 hover:border-blue-400"
      }`}
      style={style}
    >
      {label}
    </motion.div>
  );
}

function DropColumn({ id, label, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-4 rounded-2xl border-2 transition-colors ${
        isOver
          ? "border-blue-400 bg-blue-50"
          : "border-dashed border-slate-300 bg-slate-50"
      }`}
    >
      <h4 className="text-sm font-semibold text-slate-600 mb-3">{label}</h4>
      <div className="flex flex-col gap-2 min-h-[120px]">{children}</div>
    </div>
  );
}

export default function DragDropColumnsActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const columns = items[0]?.options?.columns || []; // asumimos que todas las columnas son iguales
  const [placedItems, setPlacedItems] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      const placed = {};
      initialAnswers.forEach((a) => {
        placed[a.questionId] = {
          userAnswer: a.userAnswer,
          correct: a.correct,
          points: a.pointsAwarded || 0,
          xp: a.xpAwarded || 0,
        };
      });
      setPlacedItems(placed);
      if (
        Object.keys(placed).length === items.length &&
        !completedRef.current
      ) {
        completedRef.current = true;
        const totalScore = Object.values(placed).reduce(
          (s, a) => s + a.points,
          0,
        );
        const totalXp = Object.values(placed).reduce((s, a) => s + a.xp, 0);
        onActivityComplete(totalScore, totalXp);
      }
    }
  }, [initialAnswers, items]);

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over || submitting) return;
      const itemId = active.id;
      if (placedItems[itemId]) return;

      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      const columnId = over.id; // id de la columna
      const isCorrect = item.correctAnswer === columnId;
      const points = isCorrect ? item.scoreReward : 0;
      const xp = isCorrect ? item.xpReward : 0;

      const newPlaced = {
        ...placedItems,
        [itemId]: { userAnswer: columnId, correct: isCorrect, points, xp },
      };
      setPlacedItems(newPlaced);
      setFeedback({ correct: isCorrect, xp });

      if (isCorrect) correctSound.play();

      setSubmitting(true);
      try {
        await onSubmitAnswer(activityId, itemId, columnId);
      } catch (err) {
        console.error(err);
      }
      setSubmitting(false);

      if (
        Object.keys(newPlaced).length === items.length &&
        !completedRef.current
      ) {
        completedRef.current = true;
        const totalScore = Object.values(newPlaced).reduce(
          (s, a) => s + a.points,
          0,
        );
        const totalXp = Object.values(newPlaced).reduce((s, a) => s + a.xp, 0);
        onActivityComplete(totalScore, totalXp);
      }
    },
    [
      placedItems,
      submitting,
      items,
      activityId,
      onSubmitAnswer,
      onActivityComplete,
    ],
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-4 md:py-8 md:px-60">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {columns.map((col) => (
            <DropColumn key={col.id} id={col.id} label={col.label}>
              {items
                .filter((i) => placedItems[i.id]?.userAnswer === col.id)
                .map((i) => (
                  <div
                    key={i.id}
                    className="p-2 rounded-lg bg-emerald-100 text-emerald-800 text-sm"
                  >
                    {i.prompt}
                  </div>
                ))}
            </DropColumn>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {items
            .filter((i) => !placedItems[i.id])
            .map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                label={item.prompt}
                disabled={!!placedItems[item.id]}
              />
            ))}
        </div>

        <FloatingFeedback
          show={!!feedback}
          correct={feedback?.correct}
          xp={feedback?.xp}
        />
      </div>
    </DndContext>
  );
}
