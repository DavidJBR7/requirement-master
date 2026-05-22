import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import { Lightning, Eye, CheckCircle, XCircle } from "@phosphor-icons/react";
import { CSS } from "@dnd-kit/utilities";
import { playSound } from "../../../utils/soundManager";

/* ------------------------------------------------------------------ */
/*  DraggableCard – más pequeño y compacto                            */
/* ------------------------------------------------------------------ */
function DraggableCard({
  item,
  evaluated,
  isCorrect,
  showCorrect,
  correctZoneLabel,
  dragging = false,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: { item },
      disabled: evaluated || dragging,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!evaluated ? { scale: 1.02 } : undefined}
      {...(!dragging ? listeners : {})}
      {...(!dragging ? attributes : {})}
      className={`
        relative rounded-2xl border p-3 shadow-sm backdrop-blur
        touch-none transition-all select-none cursor-grab
        active:cursor-grabbing
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
      <p className="text-xs text-slate-700 leading-snug">{item.prompt}</p>

      {evaluated && (
        <div className="mt-2 flex items-center gap-1.5">
          {isCorrect ? (
            <>
              <CheckCircle
                size={16}
                weight="fill"
                className="text-emerald-500"
              />
              <span className="text-[10px] font-semibold text-emerald-600">
                Correcto
              </span>
            </>
          ) : (
            <>
              <XCircle size={16} weight="fill" className="text-red-500" />
              <span className="text-[10px] font-semibold text-red-600">
                Incorrecto
              </span>
            </>
          )}
        </div>
      )}

      {evaluated && showCorrect && !isCorrect && (
        <p className="mt-2 text-[10px] text-blue-600 font-medium">
          Correcta: {correctZoneLabel}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid aleatorio para los círculos laterales                        */
/* ------------------------------------------------------------------ */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function ScatteredGrid({
  items,
  zoneId,
  evaluated,
  showCorrect,
  getZoneLabel,
}) {
  const cols = 2;
  const rows = Math.max(3, Math.ceil(items.length / cols) + 1);
  const totalSlots = rows * cols;

  const prevIds = useRef("");
  const [slotMap, setSlotMap] = useState({});

  useEffect(() => {
    const ids = items
      .map((i) => i.id)
      .sort()
      .join(",");
    if (ids !== prevIds.current) {
      const slots = shuffleArray(
        Array.from({ length: totalSlots }, (_, i) => i),
      );
      const newMap = {};
      items.forEach((item, idx) => {
        newMap[item.id] = slots[idx % slots.length];
      });
      setSlotMap(newMap);
      prevIds.current = ids;
    }
  }, [items, totalSlots]);

  return (
    <div
      className="grid grid-cols-2 gap-2.5"
      style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
    >
      <AnimatePresence>
        {Array.from({ length: totalSlots }, (_, slotIdx) => {
          const item = items.find((i) => slotMap[i.id] === slotIdx);
          return item ? (
            <DraggableCard
              key={item.id}
              item={item}
              evaluated={evaluated}
              isCorrect={item.correctAnswer === zoneId}
              showCorrect={showCorrect}
              correctZoneLabel={getZoneLabel(item.correctAnswer)}
            />
          ) : (
            <div
              key={`empty-${slotIdx}`}
              className="invisible"
              aria-hidden="true"
            >
              <div className="rounded-2xl border border-transparent p-3 text-xs">
                placeholder
              </div>
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DropZone – solo el área droppable y su etiqueta                   */
/* ------------------------------------------------------------------ */
function DropZone({ id, label, children, className = "", active }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        absolute rounded-full transition-all duration-200
        ${className}
        ${active || isOver ? "scale-[1.02] ring-4 ring-blue-300/50" : ""}
      `}
    >
      {/* Etiqueta */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
        <div className="px-4 py-2 rounded-full bg-white/90 border border-slate-200 shadow-sm backdrop-blur">
          <p className="text-sm font-black text-slate-700 whitespace-nowrap">
            {label}
          </p>
        </div>
      </div>

      {/* Contenido (círculo + tarjetas) */}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  VennDiagramActivity – principal                                   */
/* ------------------------------------------------------------------ */
export default function VennDiagramActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const zones = useMemo(() => {
    if (!items?.length) return [];
    return items[0].options.zones;
  }, [items]);

  const [assignments, setAssignments] = useState({});
  const [evaluated, setEvaluated] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [activeZone, setActiveZone] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (initialAnswers?.length > 0) {
      const init = {};
      initialAnswers.forEach((a) => {
        init[a.questionId] = a.userAnswer;
      });
      setAssignments(init);
    }
  }, [initialAnswers]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  );

  const getZoneItems = (zoneId) =>
    items.filter((item) => assignments[item.id] === zoneId);

  const unassignedItems = items.filter((item) => !assignments[item.id]);

  const handleDragStart = (event) => {
    if (evaluated) return;
    const item = items.find((i) => i.id === event.active.id);
    setActiveItem(item);
    const currentZone = assignments[event.active.id];
    if (currentZone) {
      setAssignments((prev) => {
        const next = { ...prev };
        delete next[event.active.id];
        return next;
      });
    }
  };

  const handleDragEnd = async (event) => {
    if (evaluated) {
      setActiveItem(null);
      return;
    }

    const { active, over } = event;
    setActiveZone(null);

    if (!over) {
      setActiveItem(null);
      return;
    }

    const itemId = active.id;
    const zoneId = over.id;

    // Actualizar estado local
    setAssignments((prev) => ({ ...prev, [itemId]: zoneId }));

    // Enviar respuesta al backend para guardar progreso
    try {
      await onSubmitAnswer(activityId, itemId, zoneId);
    } catch (err) {
      console.error("Error guardando respuesta:", err);
    }

    setActiveItem(null);
  };

  const handleValidate = async () => {
    if (evaluated || isValidating) return;

    setIsValidating(true);

    // Evaluar si todas son correctas (sin enviar al backend)
    let allCorrect = true;
    items.forEach((item) => {
      if (assignments[item.id] !== item.correctAnswer) {
        allCorrect = false;
      }
    });

    setEvaluated(true);
    playSound(allCorrect ? "correct" : "wrong");

    // Marcar la actividad como completada para mostrar el botón "Continuar"
    onActivityComplete();

    setIsValidating(false);
  };

  const isAllAssigned = items.every((item) => assignments[item.id]);
  const getZoneLabel = (zoneId) => zones.find((z) => z.id === zoneId)?.label;

  return (
    <div className="w-full px-4 py-6 md:px-8 overflow-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={(event) => {
          if (event.over?.id && !evaluated) setActiveZone(event.over.id);
        }}
        onDragCancel={() => {
          setActiveItem(null);
          setActiveZone(null);
        }}
        onDragEnd={handleDragEnd}
      >
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
            Clasifica los requisitos
          </h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
            Arrastra cada enunciado hacia el área correcta del diagrama de Venn.
          </p>
        </div>

        {/* DIAGRAMA DE VENN */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-6xl h-[430px] md:h-[620px]">
            {/* CÍRCULO IZQUIERDO */}
            <DropZone
              id="functional"
              label="Funcional"
              active={activeZone === "functional"}
              className="left-[5%] top-[4%] w-[48%] aspect-square"
            >
              <div className="absolute inset-0 rounded-full border-[4px] border-blue-500 bg-blue-500/18 backdrop-blur-sm" />
              <div className="absolute left-[6%] top-[22%] w-[62%] z-20">
                <ScatteredGrid
                  items={getZoneItems("functional")}
                  zoneId="functional"
                  evaluated={evaluated}
                  showCorrect={showCorrect}
                  getZoneLabel={getZoneLabel}
                />
              </div>
            </DropZone>

            {/* CÍRCULO DERECHO */}
            <DropZone
              id="nonFunctional"
              label="No funcional"
              active={activeZone === "nonFunctional"}
              className="right-[5%] top-[4%] w-[48%] aspect-square"
            >
              <div className="absolute inset-0 rounded-full border-[4px] border-violet-500 bg-violet-500/18 backdrop-blur-sm" />
              <div className="absolute right-[6%] top-[22%] w-[62%] z-20">
                <ScatteredGrid
                  items={getZoneItems("nonFunctional")}
                  zoneId="nonFunctional"
                  evaluated={evaluated}
                  showCorrect={showCorrect}
                  getZoneLabel={getZoneLabel}
                />
              </div>
            </DropZone>

            {/* ZONA INTERMEDIA (intersección) */}
            <DropZone
              id="both"
              label="Ambos"
              active={activeZone === "both"}
              className="left-1/2 top-[20%] -translate-x-1/2 w-[28%] aspect-square z-30"
            >
              <div className="absolute inset-0 rounded-full bg-white/60 backdrop-blur-sm" />
              <div className="absolute inset-3 space-y-2 overflow-y-auto z-20">
                <AnimatePresence>
                  {getZoneItems("both").map((item) => (
                    <DraggableCard
                      key={item.id}
                      item={item}
                      evaluated={evaluated}
                      isCorrect={item.correctAnswer === "both"}
                      showCorrect={showCorrect}
                      correctZoneLabel={getZoneLabel(item.correctAnswer)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </DropZone>
          </div>
        </div>

        {/* ENUNCIADOS SIN ASIGNAR */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">
              Enunciados
            </h3>
            <span className="text-sm font-semibold text-slate-500">
              {unassignedItems.length} restantes
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur p-4 md:p-6 shadow-sm">
            {unassignedItems.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500 font-medium">
                  Todos los enunciados fueron clasificados
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {unassignedItems.map((item) => (
                    <DraggableCard
                      key={item.id}
                      item={item}
                      evaluated={evaluated}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-center gap-4 mt-10 flex-wrap">
          {!evaluated && isAllAssigned && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleValidate}
              disabled={isValidating}
              className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Validando respuestas...</span>
                </>
              ) : (
                <>
                  <Lightning size={22} weight="fill" />
                  Validar respuestas
                </>
              )}
            </motion.button>
          )}

          {evaluated && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCorrect((prev) => !prev)}
              className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center gap-3"
            >
              <Eye size={22} weight="fill" />
              {showCorrect
                ? "Ocultar respuestas correctas"
                : "Mostrar respuestas correctas"}
            </motion.button>
          )}
        </div>

        {!isAllAssigned && !evaluated && (
          <p className="mt-5 text-center text-sm text-slate-500">
            Arrastra todos los enunciados a una zona para poder validar
          </p>
        )}

        {evaluated && (
          <p className="mt-5 text-center text-sm text-emerald-600 font-medium">
            ¡Actividad completada! Puedes continuar con la siguiente actividad.
          </p>
        )}

        {/* OVERLAY DEL DRAG */}
        <DragOverlay>
          {activeItem ? (
            <div className="w-[280px] pointer-events-none">
              <DraggableCard item={activeItem} dragging evaluated={false} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
