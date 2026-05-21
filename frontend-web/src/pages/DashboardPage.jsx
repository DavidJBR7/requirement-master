import { motion } from "framer-motion";
import {
  Trophy,
  Lightning,
  BookOpen,
  ArrowRight,
  Target,
  Brain,
  Sparkle,
  CheckCircle,
} from "@phosphor-icons/react";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

import { useDashboard } from "../features/dashboard/hooks/useDashboard";

import { useNavigate } from "react-router-dom";

const typeLabels = {
  TRUE_FALSE: "Verdadero/Falso",
  MULTIPLE_CHOICE: "Opción múltiple",
  MATCH_PAIRS: "Relacionar",
  DRAG_DROP_COLUMNS: "Columnas",
  SORTABLE_LIST: "Ordenar",
  SWIPE_CARDS: "Tarjetas",
  CHATBOT_SIMULATION: "Chat IA",
  VENN_DIAGRAM: "Venn",
  USER_STORY_BUILDER: "User Stories",
  REWRITE_REQUIREMENT: "Reescritura",
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleRoadmap = () => {
    navigate("/roadmap");
  };

  const { data: dashboard, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const { summary, lessons, performance, nextRecommendation } = dashboard;

  const radarData = performance.byType.map((item) => ({
    subject: typeLabels[item.type] || item.type,
    accuracy: item.accuracy || 5,
  }));

  const progressData = lessons.map((lesson) => ({
    name: `L${lesson.order}`,
    progreso:
      lesson.totalActivities === 0
        ? 0
        : Math.round(
            (lesson.completedActivities / lesson.totalActivities) * 100,
          ),
  }));

  const strongestType = [...performance.byType].sort(
    (a, b) => b.accuracy - a.accuracy,
  )[0];

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/40 px-4 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative overflow-hidden
            rounded-[32px]
            border border-blue-100
            bg-white
            p-8
            shadow-[0_10px_40px_rgba(59,130,246,0.08)]
            mb-8
          "
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-8 justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-5">
                <Sparkle size={18} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  Dashboard de aprendizaje
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                Sigue avanzando en
                <span className="block text-blue-600">Requeriment Master</span>
              </h1>

              <p className="text-slate-600 mt-4 max-w-2xl text-lg">
                Analiza tu rendimiento, fortalece tus habilidades y completa
                actividades para dominar la captura de requerimientos.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <HeroStat
                  icon={<Lightning size={20} weight="fill" />}
                  label="XP Total"
                  value={summary.totalXp}
                />

                <HeroStat
                  icon={<BookOpen size={20} weight="fill" />}
                  label="Lecciones"
                  value={`${summary.completedLessons}/${summary.totalLessons}`}
                />

                <HeroStat
                  icon={<Target size={20} weight="fill" />}
                  label="Precisión"
                  value={`${performance.globalAccuracy}%`}
                />
              </div>

              <button
                className="
                  mt-8
                  inline-flex items-center gap-2
                  px-5 py-3
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  transition-all
                  shadow-lg shadow-blue-500/20
                "
                onClick={handleRoadmap}
              >
                Continuar aprendiendo
                <ArrowRight size={18} weight="bold" />
              </button>
            </div>

            {/* PROGRESS */}
            <div className="flex items-center justify-center">
              <div className="relative w-56 h-56">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle
                    cx="112"
                    cy="112"
                    r="90"
                    stroke="#e2e8f0"
                    strokeWidth="14"
                    fill="transparent"
                  />

                  <motion.circle
                    cx="112"
                    cy="112"
                    r="90"
                    stroke="#2563eb"
                    strokeWidth="14"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={565}
                    initial={{ strokeDashoffset: 565 }}
                    animate={{
                      strokeDashoffset:
                        565 - (565 * summary.progressPercent) / 100,
                    }}
                    transition={{ duration: 1.5 }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-black text-slate-900">
                    {summary.progressPercent}%
                  </div>

                  <div className="text-sm text-slate-500 mt-2">
                    progreso total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* RADAR */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              lg:col-span-2
              rounded-[28px]
              border border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Rendimiento por actividad
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Precisión obtenida según cada dinámica
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold">
                {performance.globalAccuracy}% precisión
              </div>
            </div>

            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#dbeafe" />

                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#475569", fontSize: 12 }}
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
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              rounded-[28px]
              border border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Insights</h2>

            <p className="text-slate-500 text-sm mb-6">
              Estadísticas rápidas de aprendizaje
            </p>

            <div className="space-y-4">
              <InsightCard
                icon={<Brain size={22} weight="fill" />}
                title="Mejor actividad"
                value={
                  strongestType ? typeLabels[strongestType.type] : "Sin datos"
                }
              />

              <InsightCard
                icon={<Trophy size={22} weight="fill" />}
                title="Nota promedio"
                value={`${summary.averageBestScore}/100`}
              />

              <InsightCard
                icon={<Lightning size={22} weight="fill" />}
                title="XP acumulada"
                value={summary.totalXp}
              />

              <InsightCard
                icon={<CheckCircle size={22} weight="fill" />}
                title="Intentos realizados"
                value={summary.totalAttempts}
              />
            </div>

            {nextRecommendation && (
              <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs uppercase tracking-wide font-bold text-blue-600 mb-1">
                  Recomendación
                </p>

                <p className="text-sm text-blue-900 font-medium">
                  {nextRecommendation}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* AREA CHART */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-[28px]
            border border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Actividad por lección
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Avance general en las lecciones disponibles
              </p>
            </div>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="fillBlue">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#e2e8f0" />

                <XAxis dataKey="name" tick={{ fill: "#64748b" }} />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="progreso"
                  stroke="#2563eb"
                  fill="url(#fillBlue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroStat({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="
        rounded-2xl
        border border-slate-200
        bg-slate-50
        px-5 py-4
        min-w-[140px]
      "
    >
      <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
        {icon}
        {label}
      </div>

      <div className="text-3xl font-black text-slate-900">{value}</div>
    </motion.div>
  );
}

function InsightCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
          {icon}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
            {title}
          </p>

          <p className="font-bold text-slate-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
