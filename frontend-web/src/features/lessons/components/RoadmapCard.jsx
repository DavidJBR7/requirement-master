import { motion } from "framer-motion";
import {
  Lock,
  Book,
  BookOpen,
  CheckCircle,
  CaretRight,
  Medal,
  Lightning,
  Star,
} from "@phosphor-icons/react";

const statusLabels = {
  LOCKED: "Bloqueada",
  AVAILABLE: "Disponible",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
};

const statusIcons = {
  LOCKED: Lock,
  AVAILABLE: Book,
  IN_PROGRESS: BookOpen,
  COMPLETED: CheckCircle,
};

export default function RoadmapCard({ lesson, onStart }) {
  const isLocked = lesson.status === "LOCKED";
  const isCompleted = lesson.status === "COMPLETED";
  const isInProgress = lesson.status === "IN_PROGRESS";
  const isAvailable = lesson.status === "AVAILABLE";

  const Icon = statusIcons[lesson.status] || Book;

  // ─────────────────────────────────────────
  // ESTILOS POR ESTADO
  // ─────────────────────────────────────────

  const cardConfig = {
    LOCKED: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      iconBg: "bg-slate-200",
      iconColor: "text-slate-400",
      badgeBg: "bg-slate-200",
      badgeColor: "text-slate-500",
      opacity: "opacity-60",
    },
    AVAILABLE: {
      bg: "bg-white",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      badgeBg: "bg-blue-100",
      badgeColor: "text-blue-700",
      opacity: "",
    },
    IN_PROGRESS: {
      bg: "bg-amber-50/50",
      border: "border-amber-300",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      badgeBg: "bg-amber-200",
      badgeColor: "text-amber-800",
      opacity: "",
    },
    COMPLETED: {
      bg: "bg-emerald-50/50",
      border: "border-emerald-300",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      badgeBg: "bg-emerald-200",
      badgeColor: "text-emerald-800",
      opacity: "",
    },
  };

  const config = cardConfig[lesson.status];

  return (
    <motion.article
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={() => !isLocked && onStart?.()}
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border-2
        p-4
        sm:p-5
        transition-all
        duration-300

        ${config.bg}
        ${config.border}
        ${config.opacity}

        ${
          !isLocked
            ? "cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400"
            : "cursor-not-allowed"
        }
      `}
      layout
    >
      {/* GLOW PARA COMPLETADA */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-300/20 rounded-full blur-2xl"
        />
      )}

      {/* GLOW PARA EN PROGRESO */}
      {isInProgress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-8 -left-8 w-20 h-20 bg-amber-300/20 rounded-full blur-2xl"
        />
      )}

      <div className="relative z-10 flex gap-4 sm:gap-5 sm:flex-row sm:items-center">
        {/* ICONO */}
        <motion.div
          initial={{ rotate: isCompleted ? 0 : -5, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className={`
            flex-shrink-0
            w-12 h-12 sm:w-14 sm:h-14
            rounded-xl
            flex items-center justify-center
            transition-all duration-300
            ${config.iconBg}
            ${config.iconColor}
            ${!isLocked ? "group-hover:scale-110 group-hover:shadow-lg" : ""}
            ${isCompleted ? "shadow-lg shadow-emerald-500/20" : ""}
            ${isInProgress ? "shadow-lg shadow-amber-500/20" : ""}
          `}
        >
          <Icon size={22} weight="fill" className="sm:w-7 sm:h-7" />
        </motion.div>

        {/* CONTENIDO */}
        <div className="flex-1 min-w-0">
          {/* HEADER */}
          <div className="flex flex-col gap-1">
            {/* Fila superior: número de clase + estado */}
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[11px] sm:text-xs font-semibold text-slate-400 tracking-wider">
                CLASE {lesson.orderIndex || lesson.id}
              </h4>

              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`
                  text-[10px] sm:text-xs
                  px-2.5 py-1
                  rounded-full
                  font-bold
                  whitespace-nowrap
                  shadow-sm
                  ${config.badgeBg}
                  ${config.badgeColor}
                `}
              >
                {isCompleted && (
                  <CheckCircle
                    size={12}
                    weight="fill"
                    className="inline mr-1"
                  />
                )}
                {statusLabels[lesson.status]}
              </motion.span>
            </div>

            {/* Título */}
            <h3 className="text-sm sm:text-lg font-black text-slate-900 leading-snug break-words">
              {lesson.title}
            </h3>
          </div>

          {/* DESCRIPCIÓN */}
          {lesson.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500 sm:line-clamp-2"
            >
              {lesson.description}
            </motion.p>
          )}

          {/* PROGRESO */}
          {isInProgress && lesson.currentProgressPercent != null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3"
            >
              <div className="flex justify-between text-[11px] sm:text-xs mb-1.5 font-semibold text-amber-700">
                <span className="flex items-center gap-1">
                  <Star size={14} weight="fill" className="text-amber-500" />
                  Progreso
                </span>
                <span>{lesson.currentProgressPercent}%</span>
              </div>

              <div className="h-2 sm:h-2.5 rounded-full bg-amber-200/60 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lesson.currentProgressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                />
              </div>
            </motion.div>
          )}

          {/* COMPLETADA */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mt-3 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-emerald-200/50">
                <Medal size={15} weight="fill" className="text-yellow-500" />
                <span className="font-bold text-emerald-700">
                  {lesson.bestScore}/100
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-blue-200/50">
                <Lightning size={15} weight="fill" className="text-blue-500" />
                <span className="font-bold text-blue-700">
                  +{lesson.totalXp} XP
                </span>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          {!isLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-3 sm:mt-4"
            >
              <span
                className={`
                  inline-flex items-center gap-1.5
                  text-xs sm:text-sm font-bold
                  px-3 py-1.5
                  rounded-lg
                  transition-all duration-300
                  ${
                    isInProgress
                      ? "text-amber-700 bg-amber-100 hover:bg-amber-200"
                      : ""
                  }
                  ${
                    isAvailable
                      ? "text-blue-700 bg-blue-100 hover:bg-blue-200"
                      : ""
                  }
                  ${
                    isCompleted
                      ? "text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
                      : ""
                  }
                `}
              >
                <span>
                  {isInProgress
                    ? "Continuar"
                    : isCompleted
                      ? "Repasar"
                      : "Comenzar"}
                </span>
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                    repeatDelay: 3,
                  }}
                >
                  <CaretRight
                    size={14}
                    weight="bold"
                    className="sm:w-4 sm:h-4"
                  />
                </motion.span>
              </span>
            </motion.div>
          )}

          {/* BLOQUEADO */}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 flex items-center gap-2 text-xs text-slate-400"
            >
              <Lock size={14} weight="fill" />
              <span>Completa las lecciones anteriores</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
