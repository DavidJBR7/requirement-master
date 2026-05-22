// VERSION #8 – Backend simplificado, panel de detalle por tipo de actividad con intentos reales
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Trophy,
  Lightning,
  ArrowRight,
  Target,
  ArrowsCounterClockwise,
  Brain,
  Sparkle,
  CaretDown,
  Fire,
  LightbulbFilament,
  TreeStructureIcon,
  BookOpen,
} from "@phosphor-icons/react";
import { useDashboard } from "../features/dashboard/hooks/useDashboard";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const typeLabels = {
  TRUE_FALSE: "Verdadero/Falso",
  MULTIPLE_CHOICE: "Opción múltiple",
  MATCH_PAIRS: "Emparejar",
  DRAG_DROP_COLUMNS: "Arrastrar A Columnas",
  SORTABLE_LIST: "Ordenar",
  SWIPE_CARDS: "Tarjetas Deslizables",
  CHATBOT_SIMULATION: "Chatbot",
  VENN_DIAGRAM: "Venn",
  USER_STORY_BUILDER: "Historias de Usuario",
  REWRITE_REQUIREMENT: "Reescritura",
};

const typeColors = {
  TRUE_FALSE: "#6366f1",
  MULTIPLE_CHOICE: "#8b5cf6",
  MATCH_PAIRS: "#a855f7",
  DRAG_DROP_COLUMNS: "#d946ef",
  SORTABLE_LIST: "#ec4899",
  SWIPE_CARDS: "#f43f5e",
  CHATBOT_SIMULATION: "#f97316",
  VENN_DIAGRAM: "#eab308",
  USER_STORY_BUILDER: "#22c55e",
  REWRITE_REQUIREMENT: "#14b8a6",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ──────────────────────────────────────────────
// Premium Stat Card
// ──────────────────────────────────────────────
function PremiumStatCard({ icon, label, value, sub, gradient, glow }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-3xl sm:rounded-4xl border border-white/60 bg-white/80 backdrop-blur-xl p-4 sm:p-6 shadow-md",
      )}
    >
      <div className={cn("absolute inset-0 opacity-[0.08]", gradient)} />
      <div
        className={cn(
          "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-30",
          glow,
        )}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn(
              "w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center text-white",
              gradient,
            )}
          >
            {icon}
          </div>
        </div>

        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-slate-400 font-bold">
          {label}
        </p>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 leading-none break-words">
          {value}
        </h3>

        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Mini Metric Card
// ──────────────────────────────────────────────
function MiniMetricCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 shadow-sm min-w-0">
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] sm:text-sm uppercase tracking-wide text-slate-400 font-semibold truncate">
          {label}
        </p>

        <p className="font-bold text-slate-900 text-sm sm:text-base truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Insight Card
// ──────────────────────────────────────────────
function InsightCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 min-w-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-wide text-slate-500 font-semibold">
            {title}
          </p>

          <p className="font-bold text-slate-900 mt-1 text-sm sm:text-base break-words leading-snug">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Type Detail Panel (por tipo de actividad)
// ──────────────────────────────────────────────
function TypeDetailPanel({ breakdowns, selectedType, onSelect }) {
  const [open, setOpen] = useState(false);

  const current =
    breakdowns.find((b) => b.type === selectedType) || breakdowns[0];

  const hasData = current && (current.accuracy > 0 || current.totalXp > 0);

  const color = typeColors[current?.type] || "#6366f1";

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Dropdown */}
      <div className="relative mb-3">
        <button
          onClick={() => setOpen(!open)}
          className="
            w-full flex items-center justify-between
            rounded-xl border border-slate-200 bg-white px-3 py-2.5
            text-sm font-semibold text-slate-800
            hover:border-blue-300 transition-colors shadow-sm
            cursor-pointer gap-3
          "
        >
          <span className="flex items-center gap-2 truncate min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />

            <span className="truncate">
              {typeLabels[current?.type] || selectedType}
            </span>
          </span>

          <CaretDown
            size={16}
            className={`text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="
                absolute z-20 top-full left-0 right-0 mt-1
                rounded-xl border border-slate-200 bg-white
                shadow-xl max-h-52 overflow-auto
              "
            >
              {breakdowns.map((b) => (
                <li key={b.type}>
                  <button
                    onClick={() => {
                      onSelect(b.type);
                      setOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-3 text-sm font-medium
                      flex items-center gap-2
                      hover:bg-slate-50 transition-colors cursor-pointer
                      ${b.type === selectedType ? "bg-blue-50 text-blue-700" : "text-slate-700"}
                    `}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: typeColors[b.type] || "#6366f1",
                      }}
                    />

                    <span className="truncate">
                      {typeLabels[b.type] || b.type}
                    </span>

                    {b.accuracy > 0 && (
                      <span className="ml-auto text-[11px] text-slate-400 flex-shrink-0">
                        {b.accuracy}%
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Métricas en cards */}
      <div className="space-y-2 min-h-0">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold px-0.5">
          Métricas de {typeLabels[current?.type] || ""}
        </p>

        {hasData ? (
          <div className="space-y-2">
            <MiniMetricCard
              icon={<Lightning size={18} weight="fill" />}
              label="XP ganada"
              value={current.totalXp}
            />

            <MiniMetricCard
              icon={<Target size={18} weight="fill" />}
              label="Precisión"
              value={`${current.accuracy}%`}
            />

            <MiniMetricCard
              icon={<ArrowsCounterClockwise size={18} weight="fill" />}
              label="Intentos"
              value={current.attempts}
            />
          </div>
        ) : (
          <div className="text-center py-4">
            <Brain size={28} className="mx-auto text-slate-300 mb-2" />

            <p className="text-sm text-slate-500 font-medium">
              Aún no has practicado esta actividad
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Dashboard Page
// ──────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading, error } = useDashboard();

  useEffect(() => {
    if (dashboard) {
      console.log("Datos del dashboard:", dashboard);
    }
  }, [dashboard]);

  const [selectedType, setSelectedType] = useState(null);

  const derived = useMemo(() => {
    if (!dashboard) return null;

    const { summary, performance, lessons } = dashboard;

    const totalActivities = lessons.reduce(
      (acc, l) => acc + l.totalActivities,
      0,
    );

    const completedActivities = lessons.reduce(
      (acc, l) => acc + l.completedActivities,
      0,
    );

    // Mejor tipo por accuracy y por XP
    const bestAccuracy =
      [...performance.byType]
        .filter((b) => b.accuracy > 0)
        .sort((a, b) => b.accuracy - a.accuracy)[0] || null;

    const bestXp =
      [...performance.byType]
        .filter((b) => b.totalXp > 0)
        .sort((a, b) => b.totalXp - a.totalXp)[0] || null;

    // Tipo por defecto en el detalle: el de mayor precisión o el primero
    const defaultType =
      bestAccuracy?.type || performance.byType[0]?.type || null;

    return {
      totalActivities,
      completedActivities,
      bestAccuracy,
      bestXp,
      defaultType,
      nextRecommendation: dashboard.nextRecommendation,
      progressPercent: summary.progressPercent,
    };
  }, [dashboard]);

  // Seleccionar tipo por defecto cuando los datos cambien
  useEffect(() => {
    if (derived?.defaultType && !selectedType) {
      setSelectedType(derived.defaultType);
    }
  }, [derived, selectedType]);

  // ── Loading / Error States ──────────────────
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />

          <p className="text-slate-500 font-medium text-sm sm:text-base">
            Cargando dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error || !dashboard || !derived) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-red-500 font-bold text-sm sm:text-base">
            Error al cargar el dashboard
          </p>
        </div>
      </main>
    );
  }

  const { summary, performance, lessons } = dashboard;

  const {
    totalActivities,
    completedActivities,
    bestAccuracy,
    bestXp,
    progressPercent,
    nextRecommendation,
  } = derived;

  const radarData = performance.byType.map((item) => ({
    subject: typeLabels[item.type] || item.type,
    accuracy: item.accuracy || 5,
  }));

  const handleGoRecommendation = () => {
    const nextLesson = lessons.find(
      (l) =>
        l.status === "AVAILABLE" && l.completedActivities < l.totalActivities,
    );

    if (nextLesson) {
      navigate(`/lessons/${nextLesson.lessonId}`);
    } else {
      navigate("/roadmap");
    }
  };

  return (
    <main className="min-h-screen lg:h-screen bg-[#f8fbff] p-2 sm:p-4 lg:p-6 lg:overflow-hidden flex flex-col items-center justify-center">
      <div className="relative flex flex-col max-w-7xl mx-auto w-full p-3 sm:p-4 lg:p-6 bg-white rounded-3xl sm:rounded-4xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Background blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[240px] sm:w-[400px] h-[240px] sm:h-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="
            relative overflow-hidden
            rounded-[28px] sm:rounded-[36px]
            bg-gradient-to-br from-blue-900 via-blue-600 to-blue-500
            px-4 sm:px-6 md:px-12 py-4 sm:py-5
            shadow-lg
            text-white mb-4
            flex-shrink-0
          "
        >
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1 min-w-0 w-full flex flex-col lg:block">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
                Mi dashboard
              </h1>

              <p className="text-blue-100 mt-2 text-sm md:text-base leading-relaxed max-w-2xl">
                Analiza tu rendimiento, desbloquea nuevas lecciones y mejora tu
                precisión en ingeniería de requerimientos.
              </p>

              <button
                onClick={handleGoRecommendation}
                className="
                  inline-flex items-center gap-1.5
                  px-4 py-2 rounded-2xl
                  bg-white/10 backdrop-blur-md border border-white/30
                  font-bold
                  hover:scale-[1.02]
                  transition-all
                  text-sm sm:text-md
                  cursor-pointer
                  mt-5
                "
              >
                <Sparkle size={14} weight="fill" />
                Continuar aprendiendo
              </button>
            </div>

            {/* Progress donut */}
            <div className="flex-shrink-0 self-center lg:self-auto w-[16vh] h-[16vh] relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Definir el gradiente o colores */}
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>

                {/* Círculo de fondo - COMPLETO */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.66)"
                  strokeWidth="12"
                  opacity="0.3"
                />

                {/* Círculo de progreso - SOLO EL PORCENTAJE */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 38 * (progressPercent / 100)} ${2 * Math.PI * 38}`}
                  strokeDashoffset={2 * Math.PI * 38 * 0.25}
                  transform="rotate(-90 50 50)"
                />
              </svg>

              {/* Texto centrado */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl md:text-3xl font-black text-white">
                  {progressPercent}%
                </span>
                <span className="text-[9px] md:text-[10px] text-blue-100 text-center">
                  progreso total
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="flex flex-col gap-4">
          {/* ── Stats Row (Fila 1) ────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4"
          >
            <PremiumStatCard
              icon={<Target size={22} weight="fill" />}
              label="Precisión global"
              value={`${performance.globalAccuracy}%`}
              sub="de todas las respuestas"
              gradient="bg-gradient-to-br from-rose-500 to-pink-500"
              glow="bg-rose-500"
            />

            <PremiumStatCard
              icon={<Lightning size={22} weight="fill" />}
              label="XP acumulada"
              value={summary.totalXp}
              sub="Experiencia total"
              gradient="bg-gradient-to-br from-violet-500 to-indigo-500"
              glow="bg-violet-500"
            />

            <PremiumStatCard
              icon={<Trophy size={22} weight="fill" />}
              label="Promedio"
              value={`${summary.averageBestScore}/100`}
              sub="Mejor nota promedio"
              gradient="bg-gradient-to-br from-amber-400 to-orange-500"
              glow="bg-orange-500"
            />

            <PremiumStatCard
              icon={<Fire size={22} weight="fill" />}
              label="Actividades"
              value={`${completedActivities}/${totalActivities}`}
              sub="Realizadas"
              gradient="bg-gradient-to-br from-cyan-500 to-blue-500"
              glow="bg-cyan-500"
            />
          </motion.div>

          {/* ── Main Content (Fila 2) ──────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:min-h-[50vh]">
            {/* Left column: Insights */}
            <aside className="xl:col-span-1 flex flex-col gap-3 rounded-3xl sm:rounded-4xl border border-slate-200 bg-white p-4 shadow-sm min-w-0 h-full">
              {" "}
              <div className="flex items-center gap-2 mb-1">
                <TreeStructureIcon
                  size={18}
                  className="text-blue-500"
                  weight="fill"
                />
                <h2 className="text-lg font-bold text-slate-900">Insights</h2>
              </div>
              <div className="flex flex-col gap-3 flex-1 justify-between">
                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {bestAccuracy && (
                    <InsightCard
                      icon={<Target size={22} weight="fill" />}
                      title="Mayor precisión"
                      value={`${typeLabels[bestAccuracy.type] || ""}: ${bestAccuracy.accuracy}%`}
                    />
                  )}

                  {bestXp && (
                    <InsightCard
                      icon={<Lightning size={22} weight="fill" />}
                      title="Más XP"
                      value={`${typeLabels[bestXp.type] || ""}: ${bestXp.totalXp} XP`}
                    />
                  )}

                  {performance.bestLesson && (
                    <InsightCard
                      icon={<BookOpen size={22} weight="fill" />}
                      title="Mejor lección"
                      value={`CLASE ${performance.bestLesson.lessonId}: ${performance.bestLesson.bestScore}/100`}
                    />
                  )}
                </div>
                {/* Recomendación */}
                <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-white/80 backdrop-blur-xl p-5 sm:p-6">
                  <div className="absolute inset-0 opacity-[0.2] bg-gradient-to-b from-cyan-500 to-blue-500"></div>

                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-30 bg-cyan-500"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-cyan-500 to-blue-500">
                        <LightbulbFilament size={22} weight="fill" />
                      </div>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                      Recomendación
                    </p>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight break-words">
                      {nextRecommendation}
                    </h3>

                    <button
                      onClick={() => navigate("/roadmap")}
                      className="mt-5 inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white text-blue-700 font-bold shadow-sm cursor-pointer text-sm sm:text-base"
                    >
                      Continuar
                      <ArrowRight size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Center: Radar Chart */}
            <article className="xl:col-span-2 rounded-3xl sm:rounded-4xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col min-h-[380px] sm:min-h-[500px]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 flex-shrink-0">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Rendimiento por actividad
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Precisión en cada dinámica
                  </p>
                </div>

                <div className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold self-start sm:self-auto">
                  {performance.globalAccuracy}% global
                </div>
              </div>

              <div className="flex-1 min-h-[300px] sm:min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#dbeafe" />

                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#475569", fontSize: 10 }}
                    />

                    <Radar
                      dataKey="accuracy"
                      stroke="#2563eb"
                      fill="#60a5fa"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* Right column: Detalle por tipo */}
            <aside className="xl:col-span-1 rounded-3xl sm:rounded-4xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Brain size={18} weight="fill" className="text-blue-500" />

                <h2 className="text-lg font-bold text-slate-900">Detalle</h2>
              </div>

              <p className="text-sm text-slate-500 mb-3">
                Selecciona un tipo de actividad
              </p>

              {performance.byType.length > 0 ? (
                <TypeDetailPanel
                  breakdowns={performance.byType}
                  selectedType={selectedType}
                  onSelect={setSelectedType}
                />
              ) : (
                <div className="text-center py-4 text-slate-500">
                  No hay datos de actividades
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
