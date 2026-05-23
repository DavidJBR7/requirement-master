import { useState, useEffect, useMemo, useRef } from "react";
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
import { CSS } from "@dnd-kit/utilities";
import { playSound } from "../../../utils/soundManager";

/* ------------------------------------------------------------------ */
/*  DraggableCard – optimizado para móvil                             */
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
    touchAction: "none", // Previene scroll durante arrastre
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
        relative rounded-xl md:rounded-2xl border p-2 md:p-3 shadow-sm backdrop-blur
        touch-none select-none cursor-grab active:cursor-grabbing
        min-h-[44px] md:min-h-0
        ${
          evaluated
            ? isCorrect
              ? "border-emerald-400 bg-emerald-50"
              : "border-red-400 bg-red-50"
            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg active:border-blue-400"
        }
        ${isDragging ? "opacity-40" : ""}
        ${dragging ? "shadow-2xl rotate-2 scale-105" : ""}
      `}
    >
      <p className="text-[11px] md:text-xs text-slate-700 leading-snug">
        {item.prompt}
      </p>

      {evaluated && (
        <div className="mt-1.5 md:mt-2 flex items-center gap-1 md:gap-1.5">
          {isCorrect ? (
            <>
              <CheckCircle
                size={14}
                weight="fill"
                className="text-emerald-500 flex-shrink-0"
              />
              <span className="text-[9px] md:text-[10px] font-semibold text-emerald-600">
                Correcto
              </span>
            </>
          ) : (
            <>
              <XCircle
                size={14}
                weight="fill"
                className="text-red-500 flex-shrink-0"
              />
              <span className="text-[9px] md:text-[10px] font-semibold text-red-600">
                Incorrecto
              </span>
            </>
          )}
        </div>
      )}

      {evaluated && showCorrect && !isCorrect && (
        <p className="mt-1 md:mt-2 text-[9px] md:text-[10px] text-blue-600 font-medium">
          Correcta: {correctZoneLabel}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid aleatorio optimizado                                         */
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
      className="grid grid-cols-2 gap-1.5 md:gap-2.5"
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
              <div className="rounded-xl border border-transparent p-2 text-[10px]">
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
/*  DropZone – optimizado para touch                                  */
/* ------------------------------------------------------------------ */
function DropZone({ id, label, children, className = "", active }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        absolute rounded-md transition-all duration-200
        ${className}
        ${active || isOver ? "scale-[1.02] ring-4 ring-blue-300/50 z-40" : ""}
      `}
    >
      {/* Etiqueta - más compacta en móvil */}
      <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-30">
        <div className="px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/90 border border-slate-200 shadow-sm backdrop-blur">
          <p className="text-xs md:text-sm font-bold md:font-black text-slate-700 whitespace-nowrap">
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
/*  VennDiagramActivity – principal optimizado                        */
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

  // Configuración de sensores optimizada para touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
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

    setAssignments((prev) => ({ ...prev, [itemId]: zoneId }));

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

    let allCorrect = true;
    items.forEach((item) => {
      if (assignments[item.id] !== item.correctAnswer) {
        allCorrect = false;
      }
    });

    setEvaluated(true);
    playSound(allCorrect ? "correct" : "wrong");
    onActivityComplete();

    setIsValidating(false);
  };

  const isAllAssigned = items.every((item) => assignments[item.id]);
  const getZoneLabel = (zoneId) => zones.find((z) => z.id === zoneId)?.label;

  return (
    <div className="w-full px-2 md:px-4 py-3 md:py-6 lg:px-8 overflow-hidden">
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
        <div className="text-center mb-4 md:mb-10">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold md:font-black text-slate-800">
            Clasifica los requisitos
          </h2>
          <p className="mt-1 md:mt-3 text-slate-500 max-w-2xl mx-auto text-xs md:text-sm lg:text-base">
            Arrastra cada enunciado hacia el área correcta del diagrama de Venn.
          </p>
        </div>

        {/* DIAGRAMA DE VENN - Layout responsive */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-6xl h-[320px] md:h-[480px] lg:h-[620px]">
            {/* CÍRCULO IZQUIERDO */}
            <DropZone
              id="functional"
              label="Funcional"
              active={activeZone === "functional"}
              className="left-[3%] md:left-[5%] top-[4%] w-[49%] md:w-[48%] aspect-square"
            >
              <div className="absolute inset-0 rounded-full border-[3px] md:border-[4px] border-blue-500 bg-blue-500/18 backdrop-blur-sm" />
              <div className="absolute left-[4%] md:left-[6%] top-[20%] md:top-[22%] w-[64%] md:w-[62%] z-20">
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
              className="right-[3%] md:right-[5%] top-[4%] w-[49%] md:w-[48%] aspect-square"
            >
              <div className="absolute inset-0 rounded-full border-[3px] md:border-[4px] border-violet-500 bg-violet-500/18 backdrop-blur-sm" />
              <div className="absolute right-[4%] md:right-[6%] top-[20%] md:top-[22%] w-[64%] md:w-[62%] z-20">
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
              className="left-1/2 top-[18%] md:top-[20%] -translate-x-1/2 w-[30%] md:w-[28%] aspect-square z-30"
            >
              <div className="absolute inset-0 rounded-full bg-white/60 backdrop-blur-sm" />
              <div className="absolute inset-2 md:inset-3 space-y-1.5 md:space-y-2 overflow-y-auto z-20 max-h-[80%]">
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
        <div className="mt-4 md:mt-10">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-xs md:text-sm font-bold md:font-black uppercase tracking-wide text-slate-600">
              Enunciados
            </h3>
            <span className="text-xs md:text-sm font-semibold text-slate-500">
              {unassignedItems.length} restantes
            </span>
          </div>

          <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white/80 backdrop-blur p-2 md:p-4 lg:p-6 shadow-sm">
            {unassignedItems.length === 0 ? (
              <div className="py-6 md:py-8 text-center">
                <p className="text-sm md:text-base text-slate-500 font-medium">
                  Todos los enunciados fueron clasificados
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
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
        <div className="flex justify-center gap-3 md:gap-4 mt-6 md:mt-10 flex-wrap">
          {!evaluated && isAllAssigned && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleValidate}
              disabled={isValidating}
              className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center gap-2 md:gap-3 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isValidating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
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
                  <span className="whitespace-nowrap">Validando...</span>
                </>
              ) : (
                <>
                  <Lightning size={18} weight="fill" className="md:hidden" />
                  <Lightning
                    size={22}
                    weight="fill"
                    className="hidden md:block"
                  />
                  <span className="whitespace-nowrap">Validar respuestas</span>
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
              className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center gap-2 md:gap-3 text-sm md:text-base cursor-pointer"
            >
              <Eye size={18} weight="fill" className="md:hidden" />
              <Eye size={22} weight="fill" className="hidden md:block" />
              <span className="whitespace-nowrap">
                {showCorrect ? "Ocultar correctas" : "Mostrar correctas"}
              </span>
            </motion.button>
          )}
        </div>

        {!isAllAssigned && !evaluated && (
          <p className="mt-3 md:mt-5 text-center text-xs md:text-sm text-slate-500">
            Arrastra todos los enunciados a una zona para poder validar
          </p>
        )}

        {evaluated && (
          <p className="mt-3 md:mt-5 text-center text-xs md:text-sm text-emerald-600 font-medium">
            ¡Actividad completada! Puedes continuar con la siguiente actividad.
          </p>
        )}

        {/* OVERLAY DEL DRAG */}
        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <div className="w-[250px] md:w-[280px] pointer-events-none opacity-90">
              <DraggableCard item={activeItem} dragging evaluated={false} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
