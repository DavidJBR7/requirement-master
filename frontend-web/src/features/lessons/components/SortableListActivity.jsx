import { useState, useEffect, useCallback, useRef } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import FloatingFeedback from "./FloatingFeedback";
import { Howl } from "howler";

const correctSound = new Howl({ src: ["/sounds/correct.mp3"] });
const incorrectSound = new Howl({ src: ["/sounds/incorrect.mp3"] });

function SortableItem({ id, content, disabled, isCorrect, isWrong }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-4 rounded-xl border-2 bg-white mb-2 flex items-center justify-between select-none ${
        disabled
          ? isCorrect
            ? "border-emerald-400 bg-emerald-50"
            : "border-rose-400 bg-rose-50"
          : "border-slate-200 hover:border-blue-300 cursor-grab active:cursor-grabbing"
      }`}
      style={style}
    >
      <span className="font-medium">{content}</span>
      {disabled &&
        (isCorrect ? (
          <CheckCircle size={20} className="text-emerald-500" />
        ) : (
          <XCircle size={20} className="text-rose-500" />
        ))}
    </div>
  );
}

export default function SortableListActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const initialOrder = useRef(items.map((i) => i.id)); // orden aleatorio inicial (podría venir del backend)
  const [itemsState, setItemsState] = useState([]);
  const [order, setOrder] = useState(initialOrder.current);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [feedback, setFeedback] = useState(null);
  const completedRef = useRef(false);

  useEffect(() => {
    // Si hay respuestas previas, asumimos que ya ordenó y validó
    if (
      initialAnswers &&
      initialAnswers.length > 0 &&
      initialAnswers[0].userAnswer
    ) {
      // userAnswer viene como array de strings (ids en orden)
      const savedOrder = JSON.parse(initialAnswers[0].userAnswer);
      setOrder(savedOrder);
      setSubmitted(true);
      // Evaluar resultados
      const res = {};
      let totalPoints = 0;
      let totalXp = 0;
      savedOrder.forEach((id, index) => {
        const item = items.find((i) => i.id === id);
        const isCorrect = item.correctOrder === index;
        res[id] = {
          correct: isCorrect,
          points: isCorrect ? item.scoreReward : 0,
          xp: isCorrect ? item.xpReward : 0,
        };
        totalPoints += isCorrect ? item.scoreReward : 0;
        totalXp += isCorrect ? item.xpReward : 0;
      });
      setResults(res);
      if (!completedRef.current) {
        completedRef.current = true;
        onActivityComplete(totalPoints, totalXp);
      }
    }
  }, [initialAnswers, items]);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id || submitted) return;
      setOrder((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        const newOrder = [...prev];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, active.id);
        return newOrder;
      });
    },
    [submitted],
  );

  const handleValidate = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);

    // Evaluar
    const res = {};
    let totalPoints = 0;
    let totalXp = 0;
    order.forEach((id, index) => {
      const item = items.find((i) => i.id === id);
      const isCorrect = item.correctOrder === index;
      res[id] = {
        correct: isCorrect,
        points: isCorrect ? item.scoreReward : 0,
        xp: isCorrect ? item.xpReward : 0,
      };
      totalPoints += isCorrect ? item.scoreReward : 0;
      totalXp += isCorrect ? item.xpReward : 0;
    });
    setResults(res);

    // Feedback global
    const overallCorrect = totalPoints > 0;
    setFeedback({ correct: overallCorrect, xp: totalXp });
    if (overallCorrect) correctSound.play();
    else incorrectSound.play();

    // Enviar al backend el array ordenado
    try {
      await onSubmitAnswer(activityId, items[0]?.id, JSON.stringify(order)); // questionId podría ser el de un ítem genérico
    } catch (err) {
      console.error(err);
    }

    if (!completedRef.current) {
      completedRef.current = true;
      onActivityComplete(totalPoints, totalXp);
    }
  }, [submitted, order, items, activityId, onSubmitAnswer, onActivityComplete]);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="p-4 md:py-8 md:px-60">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Ordena los pasos correctamente
          </h3>
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {order.map((id) => {
                const item = items.find((i) => i.id === id);
                return (
                  <SortableItem
                    key={id}
                    id={id}
                    content={item.content}
                    disabled={submitted}
                    isCorrect={results[id]?.correct}
                    isWrong={submitted && !results[id]?.correct}
                  />
                );
              })}
            </div>
          </SortableContext>

          {!submitted && (
            <div className="mt-6 flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleValidate}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                Validar orden
              </motion.button>
            </div>
          )}

          <FloatingFeedback
            show={!!feedback}
            correct={feedback?.correct}
            xp={feedback?.xp}
          />
        </div>
      </div>
    </DndContext>
  );
}
