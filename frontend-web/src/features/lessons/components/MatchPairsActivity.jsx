import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../../../utils/soundManager";

/* =========================================================
   CONNECTION LINE (solo curvas, sin círculos)
========================================================= */
function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  active,
  evaluated,
  correct,
  onClick,
}) {
  const dx = Math.abs(x2 - x1);
  const curve = Math.max(dx * 0.35, 90);

  const path = `
    M ${x1} ${y1}
    C ${x1 + curve} ${y1},
      ${x2 - curve} ${y2},
      ${x2} ${y2}
  `;

  const color = evaluated
    ? correct
      ? "#10b981"
      : "#ef4444"
    : active
      ? "#38bdf8"
      : "#94a3b8";

  return (
    <g
      onClick={onClick}
      style={{
        cursor: evaluated ? "default" : "pointer",
        pointerEvents: evaluated ? "none" : "auto",
      }}
    >
      {/* Glow de la línea */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={12}
        opacity={0.12}
        strokeLinecap="round"
      />
      {/* Línea principal */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.95}
        style={{
          filter: active
            ? "drop-shadow(0 0 10px rgba(56,189,248,.9))"
            : "drop-shadow(0 0 4px rgba(0,0,0,.2))",
          transition: active ? "none" : "all .2s ease",
        }}
      />
    </g>
  );
}

/* =========================================================
   CÍRCULOS DEL EXTREMO (capa superior)
========================================================= */
function ConnectionEndpoint({ x, y, color }) {
  return (
    <g style={{ pointerEvents: "none" }}>
      <circle cx={x} cy={y} r={10} fill={color} opacity={0.15} />
      <circle cx={x} cy={y} r={6} fill={color} />
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function MatchPairsActivity({
  items,
  initialAnswers,
  onSubmitAnswer,
  onActivityComplete,
  activityId,
}) {
  const definitions = items || [];

  /* =========================================================
     BUILD DEFINITIONS
  ========================================================= */
  const concepts = useMemo(() => {
    const map = {};
    const list = [];

    definitions.forEach((item) => {
      const definitionObj = item.options?.definitions?.find(
        (d) => d.id === item.correctAnswer,
      );

      if (!map[item.correctAnswer]) {
        map[item.correctAnswer] = {
          id: item.correctAnswer,
          label: definitionObj?.text || item.correctAnswer,
        };
        list.push(map[item.correctAnswer]);
      }
    });

    return [...list].sort(() => Math.random() - 0.5);
  }, [definitions]);

  /* =========================================================
     STATES
  ========================================================= */
  const [connections, setConnections] = useState({});
  const [evaluated, setEvaluated] = useState(false);
  const [answerRecords, setAnswerRecords] = useState({});

  const [activeDefId, setActiveDefId] = useState(null);
  const [activeAnchorPos, setActiveAnchorPos] = useState({ x: 0, y: 0 });
  const [linePositions, setLinePositions] = useState({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [springMousePos, setSpringMousePos] = useState({ x: 0, y: 0 });

  /* =========================================================
     REFS
  ========================================================= */
  const containerRef = useRef(null);
  const defRefs = useRef({});
  const conceptRefs = useRef({});
  const animationFrameRef = useRef();

  /* =========================================================
     LOAD PREVIOUS ANSWERS
  ========================================================= */
  useEffect(() => {
    if (initialAnswers?.length > 0) {
      const conns = {};
      const records = {};

      initialAnswers.forEach((a) => {
        conns[a.questionId] = a.userAnswer;
        records[a.questionId] = {
          correct: a.correct,
          points: a.pointsAwarded,
          xp: a.xpAwarded,
        };
      });

      setConnections(conns);
      setAnswerRecords(records);

      if (Object.keys(conns).length === definitions.length) {
        setEvaluated(true);
      }
    }
  }, [initialAnswers, definitions.length]);

  /* =========================================================
     COMPLETE
  ========================================================= */
  useEffect(() => {
    if (evaluated && Object.keys(answerRecords).length === definitions.length) {
      const totalScore = Object.values(answerRecords).reduce(
        (sum, rec) => sum + (rec.points || 0),
        0,
      );
      const totalXp = Object.values(answerRecords).reduce(
        (sum, rec) => sum + (rec.xp || 0),
        0,
      );
      onActivityComplete(totalScore, totalXp);
    }
  }, [evaluated, answerRecords, definitions.length, onActivityComplete]);

  /* =========================================================
     SPRING PHYSICS
  ========================================================= */
  useEffect(() => {
    const animate = () => {
      setSpringMousePos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.18,
        y: prev.y + (mousePos.y - prev.y) * 0.18,
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [mousePos]);

  /* =========================================================
     UPDATE LINE POSITIONS
  ========================================================= */
  const updateLinePositions = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPositions = {};

    Object.entries(connections).forEach(([defId, conceptId]) => {
      const defEl = defRefs.current[defId];
      const conEl = conceptRefs.current[conceptId];

      if (defEl && conEl) {
        const defRect = defEl.getBoundingClientRect();
        const conRect = conEl.getBoundingClientRect();

        newPositions[defId] = {
          x1: defRect.right - containerRect.left,
          y1: defRect.top + defRect.height / 2 - containerRect.top,
          x2: conRect.left - containerRect.left,
          y2: conRect.top + conRect.height / 2 - containerRect.top,
        };
      }
    });

    setLinePositions(newPositions);
  }, [connections]);

  useLayoutEffect(() => {
    updateLinePositions();
  }, [connections, updateLinePositions]);

  /* =========================================================
     RESIZE / SCROLL
  ========================================================= */
  useEffect(() => {
    const handleResizeOrScroll = () => {
      updateLinePositions();
      if (activeDefId && defRefs.current[activeDefId] && containerRef.current) {
        const defRect = defRefs.current[activeDefId].getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setActiveAnchorPos({
          x: defRect.right - containerRect.left,
          y: defRect.top + defRect.height / 2 - containerRect.top,
        });
      }
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);
    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, [updateLinePositions, activeDefId]);

  /* =========================================================
     MOUSE FOLLOW
  ========================================================= */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!activeDefId || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeDefId]);

  /* =========================================================
     ESC TO CANCEL
  ========================================================= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveDefId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* =========================================================
     ACTIVE ANCHOR INIT
  ========================================================= */
  useLayoutEffect(() => {
    if (activeDefId && defRefs.current[activeDefId] && containerRef.current) {
      const defRect = defRefs.current[activeDefId].getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const pos = {
        x: defRect.right - containerRect.left,
        y: defRect.top + defRect.height / 2 - containerRect.top,
      };
      setActiveAnchorPos(pos);
      setMousePos(pos);
      setSpringMousePos(pos);
    }
  }, [activeDefId]);

  /* =========================================================
     HANDLERS
  ========================================================= */
  const handleDefinitionClick = (defId) => {
    if (evaluated) return;

    // Si se pulsa la misma definición activa → cancelar
    if (activeDefId === defId) {
      setActiveDefId(null);
      return;
    }

    // Si la definición ya tiene una conexión → desconectar y activar arrastre
    if (connections[defId]) {
      setConnections((prev) => {
        const next = { ...prev };
        delete next[defId];
        return next;
      });
      setAnswerRecords((prev) => {
        const next = { ...prev };
        delete next[defId];
        return next;
      });
      // Activar inmediatamente el modo arrastre para esa definición
      setActiveDefId(defId);
      return;
    }

    // Definición libre → empezar a arrastrar
    setActiveDefId(defId);
  };

  const handleConceptClick = (conceptId) => {
    if (evaluated) return;

    // Buscar si este concepto ya está conectado a alguna definición
    const connectedDefId = Object.keys(connections).find(
      (defId) => connections[defId] === conceptId,
    );

    // Si el concepto ya está conectado, desconectar y activar arrastre desde esa definición
    if (connectedDefId) {
      setConnections((prev) => {
        const next = { ...prev };
        delete next[connectedDefId];
        return next;
      });
      setAnswerRecords((prev) => {
        const next = { ...prev };
        delete next[connectedDefId];
        return next;
      });
      setActiveDefId(connectedDefId);
      return;
    }

    // Si no hay definición activa, no se puede conectar
    if (!activeDefId) return;

    // Conectar la definición activa con este concepto
    setConnections((prev) => ({
      ...prev,
      [activeDefId]: conceptId,
    }));
    setActiveDefId(null);
    playSound("correct");
  };

  const handleLineClick = (defId) => {
    if (evaluated) return;

    // Desconectar y activar arrastre para esa definición
    setConnections((prev) => {
      const next = { ...prev };
      delete next[defId];
      return next;
    });
    setAnswerRecords((prev) => {
      const next = { ...prev };
      delete next[defId];
      return next;
    });
    setActiveDefId(defId);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */
  const handleSubmitAll = async () => {
    if (evaluated) return;
    const entries = Object.entries(connections);
    if (entries.length < definitions.length) return;

    setEvaluated(true);
    const newRecords = { ...answerRecords };
    let totalScore = 0;
    let totalXp = 0;

    for (const [defId, conceptId] of entries) {
      try {
        const response = await onSubmitAnswer(activityId, defId, conceptId);
        newRecords[defId] = {
          correct: response.correct,
          points: response.pointsAwarded,
          xp: response.xpAwarded,
        };
        totalScore += response.pointsAwarded;
        totalXp += response.xpAwarded;
        playSound(response.correct ? "correct" : "wrong");
      } catch (error) {
        console.error(error);
        newRecords[defId] = { correct: false, points: 0, xp: 0 };
      }
    }

    setAnswerRecords(newRecords);
    onActivityComplete(totalScore, totalXp);
  };

  /* =========================================================
     HELPERS
  ========================================================= */
  const allConnected =
    Object.keys(connections).length === definitions.length && !evaluated;

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div
      ref={containerRef}
      className="
        relative overflow-hidden border border-slate-200
        bg-gradient-to-br from-slate-50 via-white to-blue-50
      "
    >
      {/* BG BLOBS */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />

      {/* SVG LÍNEAS (debajo de las tarjetas) */}
      <svg
        className="absolute inset-0 z-10"
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {Object.entries(linePositions).map(([defId, pos]) => {
          const record = answerRecords[defId];
          return (
            <ConnectionLine
              key={defId}
              x1={pos.x1}
              y1={pos.y1}
              x2={pos.x2}
              y2={pos.y2}
              active={false}
              evaluated={evaluated}
              correct={record?.correct}
              onClick={() => handleLineClick(defId)}
            />
          );
        })}

        {activeDefId && (
          <ConnectionLine
            x1={activeAnchorPos.x}
            y1={activeAnchorPos.y}
            x2={springMousePos.x}
            y2={springMousePos.y}
            active={true}
            evaluated={false}
          />
        )}
      </svg>

      {/* CONTENIDO (tarjetas, z-20) */}
      <div className="relative z-20 flex flex-col lg:flex-row gap-80 p-5 lg:p-8">
        {/* LEFT – CONCEPTOS */}
        <div className="flex-1">
          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Conceptos
            </h2>
          </div>
          <div className="space-y-4">
            {definitions.map((def) => {
              const isConnected = !!connections[def.id];
              const record = answerRecords[def.id];
              const isCorrect = record?.correct;

              return (
                <motion.div
                  key={def.id}
                  layout
                  ref={(el) => (defRefs.current[def.id] = el)}
                  onClick={() => handleDefinitionClick(def.id)}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    group relative overflow-hidden rounded-3xl border p-5 cursor-pointer transition-all duration-300
                    ${
                      evaluated
                        ? isCorrect
                          ? "border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-100"
                          : "border-red-300 bg-red-50 shadow-lg shadow-red-100"
                        : isConnected
                          ? "border-cyan-400 bg-cyan-50 shadow-xl shadow-cyan-100"
                          : activeDefId === def.id
                            ? "border-blue-500 bg-blue-100 shadow-2xl scale-[1.02]"
                            : "border-slate-300 bg-white/90 hover:border-blue-300 hover:shadow-xl"
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {def.prompt}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Selecciona la definición correcta
                      </p>
                    </div>
                    {/* Se ha eliminado el botón con la X */}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT – DEFINICIONES */}
        <div className="flex-1">
          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">
              Definiciones
            </h2>
          </div>
          <div className="space-y-4">
            {concepts.map((concept) => {
              const connectedDef = Object.keys(connections).find(
                (defId) => connections[defId] === concept.id,
              );

              return (
                <motion.div
                  key={concept.id}
                  layout
                  ref={(el) => (conceptRefs.current[concept.id] = el)}
                  onClick={() => handleConceptClick(concept.id)}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative overflow-hidden rounded-3xl border p-5 cursor-pointer transition-all duration-300
                    ${
                      connectedDef
                        ? "border-cyan-400 bg-cyan-50 shadow-xl shadow-cyan-100"
                        : activeDefId
                          ? "border-dashed border-slate-300 bg-white/90 hover:bg-cyan-50 hover:border-cyan-300"
                          : "border-slate-300 bg-white/90 hover:border-blue-300 hover:shadow-xl"
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <p className="text-slate-700 leading-relaxed">
                      {concept.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SVG CÍRCULOS (encima de las tarjetas, z-30) */}
      <svg
        className="absolute inset-0 z-30"
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {Object.entries(linePositions).map(([defId, pos]) => {
          const record = answerRecords[defId];
          const color = evaluated
            ? record?.correct
              ? "#10b981"
              : "#ef4444"
            : "#38bdf8";
          return (
            <ConnectionEndpoint
              key={defId}
              x={pos.x2}
              y={pos.y2}
              color={color}
            />
          );
        })}

        {activeDefId && (
          <ConnectionEndpoint
            x={springMousePos.x}
            y={springMousePos.y}
            color="#38bdf8"
          />
        )}
      </svg>

      {/* BOTTOM */}
      <div className="relative z-20 px-6 pb-8">
        {allConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmitAll}
              className="px-10 py-4 rounded-2xl font-bold text-white shadow-2xl bg-gradient-to-r from-blue-600 to-sky-500 cursor-pointer"
            >
              Validar respuestas
            </motion.button>
          </motion.div>
        )}

        {!allConnected && Object.keys(connections).length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-slate-500 mt-3"
          >
            Conecta todos los pares para validar
          </motion.p>
        )}
      </div>
    </div>
  );
}
