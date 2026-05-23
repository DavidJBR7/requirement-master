import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Lightning, Eye, CheckCircle, XCircle } from "@phosphor-icons/react";
import { playSound } from "../../../utils/soundManager";

/* ---------- DraggableCard (igual que en Venn, adaptada) ---------- */
function DraggableCard({
  item,
  evaluated,
  isCorrect,
  showCorrect,
  correctLabel,
  dragging,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: { item },
      disabled: evaluated || dragging,
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    touchAction: "none",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!evaluated ? { scale: 1.02 } : undefined}
      whileTap={!evaluated ? { scale: 0.98 } : undefined}
      {...(!dragging ? listeners : {})}
      {...(!dragging ? attributes : {})}
      className={`
        relative rounded-xl md:rounded-2xl border p-3 shadow-sm select-none cursor-grab active:cursor-grabbing
        ${
          evaluated
            ? isCorrect
              ? "border-emerald-400 bg-emerald-50"
              : "border-red-400 bg-red-50"
            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg"
        }
        ${isDragging ? "opacity-40" : ""}
        ${dragging ? "shadow-2xl rotate-2 scale-105" : ""}
      `}
    >
      <p className="text-xs md:text-sm text-slate-700 leading-snug">
        {item.prompt}
      </p>

      {evaluated && (
        <div className="mt-2 flex items-center gap-1">
          {isCorrect ? (
            <>
              <CheckCircle
                size={14}
                weight="fill"
                className="text-emerald-500"
              />
              <span className="text-[10px] font-semibold text-emerald-600">
                Correcto
              </span>
            </>
          ) : (
            <>
              <XCircle size={14} weight="fill" className="text-red-500" />
              <span className="text-[10px] font-semibold text-red-600">
                Incorrecto
              </span>
            </>
          )}
        </div>
      )}

      {evaluated && showCorrect && !isCorrect && (
        <p className="mt-2 text-[10px] text-blue-600 font-medium">
          Correcta: {correctLabel}
        </p>
      )}
    </motion.div>
  );
}

/* ---------- DroppableColumn ---------- */
function DroppableColumn({
  id,
  label,
  items,
  evaluated,
  showCorrect,
  columnMap,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 min-h-[200px] rounded-2xl border-2 border-dashed p-3 transition-all duration-200
        ${isOver ? "border-blue-400 bg-blue-50 scale-[1.02]" : "border-slate-300 bg-white/70"}
      `}
    >
      <h4 className="text-sm font-bold text-slate-600 mb-3">{label}</h4>
      <div className="space-y-2">
        <AnimatePresence>
          {items.map((item) => (
            <DraggableCard
              key={item.id}
              item={item}
              evaluated={evaluated}
              isCorrect={item.correctAnswer === id}
              showCorrect={showCorrect}
              correctLabel={columnMap[item.correctAnswer]}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Componente principal ---------- */
export default function DragDropColumnsActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const columns = useMemo(() => {
    if (!items?.length) return [];
    return items[0].options.columns;
  }, [items]);

  const columnMap = useMemo(() => {
    const map = {};
    columns.forEach((col) => (map[col.id] = col.label));
    return map;
  }, [columns]);

  const [assignments, setAssignments] = useState({});
  const [evaluated, setEvaluated] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Cargar respuestas previas
  useEffect(() => {
    if (initialAnswers?.length > 0) {
      const init = {};
      initialAnswers.forEach((a) => (init[a.questionId] = a.userAnswer));
      setAssignments(init);
    }
  }, [initialAnswers]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  const unassignedItems = items.filter((item) => !assignments[item.id]);
  const allAssigned = unassignedItems.length === 0;

  const handleDragStart = (event) => {
    if (evaluated) return;
    const item = items.find((i) => i.id === event.active.id);
    setActiveItem(item);
    // Quitar asignación anterior para que pueda moverse
    if (assignments[event.active.id]) {
      setAssignments((prev) => {
        const next = { ...prev };
        delete next[event.active.id];
        return next;
      });
    }
  };

  const handleDragEnd = async (event) => {
    setActiveItem(null);
    if (evaluated) return;

    const { active, over } = event;
    if (!over) return; // soltó en ninguna zona válida

    const itemId = active.id;
    const columnId = over.id;

    setAssignments((prev) => ({ ...prev, [itemId]: columnId }));

    try {
      await onSubmitAnswer(activityId, itemId, columnId);
    } catch (err) {
      console.error("Error guardando respuesta:", err);
    }
  };

  const handleValidate = () => {
    if (evaluated || !allAssigned) return;
    let allCorrect = true;
    items.forEach((item) => {
      if (assignments[item.id] !== item.correctAnswer) allCorrect = false;
    });
    setEvaluated(true);
    playSound(allCorrect ? "correct" : "wrong");
    onActivityComplete();
  };

  return (
    <div className="w-full px-3 md:px-6 py-6 lg:px-10">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-3xl font-black text-slate-800">
            Clasifica los elementos
          </h2>
          <p className="mt-2 text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
            Arrastra cada enunciado a la columna correspondiente.
          </p>
        </div>

        {/* Columnas */}
        <div className="flex flex-wrap gap-4 justify-center">
          {columns.map((col) => (
            <DroppableColumn
              key={col.id}
              id={col.id}
              label={col.label}
              items={items.filter((it) => assignments[it.id] === col.id)}
              evaluated={evaluated}
              showCorrect={showCorrect}
              columnMap={columnMap}
            />
          ))}
        </div>

        {/* Zona de enunciados sin asignar */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">
              Pendientes
            </h3>
            <span className="text-sm font-semibold text-slate-500">
              {unassignedItems.length} restantes
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            {unassignedItems.length === 0 ? (
              <p className="py-8 text-center text-slate-500 font-medium">
                Todos los enunciados fueron clasificados
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <AnimatePresence>
                  {unassignedItems.map((item) => (
                    <DraggableCard
                      key={item.id}
                      item={item}
                      evaluated={false}
                      isCorrect={false}
                      showCorrect={false}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          {!evaluated && allAssigned && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleValidate}
              className="px-8 py-3 rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center gap-2 cursor-pointer"
            >
              <Lightning size={20} weight="fill" />
              Validar respuestas
            </motion.button>
          )}

          {evaluated && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCorrect(!showCorrect)}
              className="px-6 py-3 rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center gap-2 cursor-pointer"
            >
              <Eye size={20} weight="fill" />
              {showCorrect ? "Ocultar correctas" : "Mostrar correctas"}
            </motion.button>
          )}
        </div>

        {!allAssigned && !evaluated && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Arrastra todos los enunciados para validar
          </p>
        )}

        {evaluated && (
          <p className="mt-4 text-center text-sm text-emerald-600 font-medium">
            Actividad completada
          </p>
        )}

        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <div className="w-[280px] pointer-events-none opacity-90">
              <DraggableCard item={activeItem} evaluated={false} dragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
