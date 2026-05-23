import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Lightning, CheckCircle, XCircle, House } from "@phosphor-icons/react";
import { playSound } from "../../../utils/soundManager";

function SortableItem({ id, content, evaluated, isCorrect, index }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative flex items-center gap-3 p-4 rounded-xl border bg-white shadow-sm cursor-grab active:cursor-grabbing
        ${
          evaluated
            ? isCorrect
              ? "border-emerald-400 bg-emerald-50"
              : "border-red-400 bg-red-50"
            : "border-slate-200 hover:border-blue-300"
        }
        ${isDragging ? "shadow-2xl z-50" : ""}
      `}
      {...attributes}
      {...listeners}
    >
      <House size={20} className="text-slate-400 flex-shrink-0" />
      <span className="flex-1 text-sm md:text-base text-slate-700 font-medium">
        {content}
      </span>
      {evaluated && (
        <span className="flex-shrink-0">
          {isCorrect ? (
            <CheckCircle size={20} weight="fill" className="text-emerald-500" />
          ) : (
            <XCircle size={20} weight="fill" className="text-red-500" />
          )}
        </span>
      )}
    </motion.li>
  );
}

export default function SortableListActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  // Estado: orden actual de ids
  const [orderedIds, setOrderedIds] = useState([]);
  const [evaluated, setEvaluated] = useState(false);
  const [scoreData, setScoreData] = useState({ total: 0, xp: 0 });

  // Cargar respuestas previas (orden guardado)
  useEffect(() => {
    if (initialAnswers?.length > 0) {
      // Se espera que haya un único answer con el array completo
      const savedOrder = initialAnswers[0]?.userAnswer;
      if (Array.isArray(savedOrder) && savedOrder.length === items.length) {
        setOrderedIds(savedOrder);
      } else {
        // Fallback: orden original aleatorio
        const shuffled = items
          .map((it) => it.id)
          .sort(() => Math.random() - 0.5);
        setOrderedIds(shuffled);
      }
    } else {
      // Sin respuestas previas: aleatorizar
      const shuffled = items.map((it) => it.id).sort(() => Math.random() - 0.5);
      setOrderedIds(shuffled);
    }
  }, [initialAnswers, items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (evaluated || !over || active.id === over.id) return;

      setOrderedIds((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        const newOrder = arrayMove(prev, oldIndex, newIndex);

        // Guardar progreso automáticamente
        onSubmitAnswer(activityId, "sortable", newOrder).catch((err) =>
          console.error("Error guardando orden:", err),
        );
        return newOrder;
      });
    },
    [evaluated, activityId, onSubmitAnswer],
  );

  const handleValidate = () => {
    if (evaluated) return;

    // Calcular puntos basados en posiciones correctas
    let correctCount = 0;
    items.forEach((item) => {
      const currentPos = orderedIds.indexOf(item.id);
      if (currentPos === item.correctOrder) correctCount++;
    });

    const totalItems = items.length;
    const maxScore =
      items.reduce((sum, it) => sum + (it.scoreReward || 0), 0) || 30;
    const maxXp = items.reduce((sum, it) => sum + (it.xpReward || 0), 0) || 15;

    const earnedScore = Math.round((correctCount / totalItems) * maxScore);
    const earnedXp = Math.round((correctCount / totalItems) * maxXp);

    setScoreData({ total: earnedScore, xp: earnedXp });
    setEvaluated(true);
    playSound(correctCount === totalItems ? "correct" : "wrong");

    // Llamar a onActivityComplete con los totales calculados
    onActivityComplete(earnedScore, earnedXp);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-center text-xl md:text-3xl font-black text-slate-800 mb-2">
        Ordena los pasos
      </h2>
      <p className="text-center text-slate-500 mb-8 text-sm md:text-base">
        Arrastra cada elemento para colocarlo en el orden correcto.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedIds}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-3">
            {orderedIds.map((id, index) => {
              const item = items.find((it) => it.id === id);
              if (!item) return null;
              const isCorrectPosition =
                evaluated && item.correctOrder === index;
              return (
                <SortableItem
                  key={id}
                  id={id}
                  content={item.content}
                  evaluated={evaluated}
                  isCorrect={isCorrectPosition}
                  index={index}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="flex justify-center mt-10">
        {!evaluated ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleValidate}
            className="px-8 py-3 rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center gap-2 cursor-pointer"
          >
            <Lightning size={20} weight="fill" />
            Validar orden
          </motion.button>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-emerald-600 font-semibold text-lg"
          >
            ¡Actividad completada! Puntuación: {scoreData.total} pts
          </motion.p>
        )}
      </div>
    </div>
  );
}
