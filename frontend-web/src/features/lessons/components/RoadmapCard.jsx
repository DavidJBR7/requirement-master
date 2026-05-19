import {
  Lock,
  Book,
  BookOpen,
  CheckCircle,
  CaretRight,
  Medal,
  Lightning,
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

  const Icon = statusIcons[lesson.status] || Book;

  const cardStyles = isLocked
    ? "bg-gray-100 border-gray-200 opacity-70"
    : lesson.status === "COMPLETED"
      ? "bg-green-50 border-green-300"
      : lesson.status === "IN_PROGRESS"
        ? "bg-yellow-50 border-yellow-300"
        : "bg-white border-blue-200 active:scale-[0.99]";

  return (
    <article
      onClick={() => !isLocked && onStart?.()}
      className={`
        border-2 rounded-2xl p-3.5 sm:p-6 transition-all duration-200 sm:duration-300 sm:group
        ${cardStyles}
        ${!isLocked ? "cursor-pointer sm:hover:shadow-lg sm:hover:-translate-y-1 sm:hover:border-blue-400" : ""}
      `}
    >
      <div className="flex gap-3 sm:gap-5 sm:flex-row sm:items-center">
        {/* ICONO */}
        <div
          className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center sm:transition-transform sm:duration-300 sm:group-hover:scale-110 ${
            lesson.status === "COMPLETED" ? "bg-green-100 text-green-700" : ""
          } ${
            lesson.status === "IN_PROGRESS"
              ? "bg-yellow-300 text-yellow-700"
              : ""
          } ${lesson.status === "LOCKED" ? "bg-gray-200 text-gray-500" : ""} ${lesson.status === "AVAILABLE" ? "bg-blue-100 text-blue-700" : ""}`}
        >
          <Icon size={22} weight="fill" className="sm:w-7 sm:h-7" />
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 min-w-0">
          {/* HEADER */}
          <div className="flex flex-col gap-1">
            {/* Fila superior: número de clase + estado */}
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold text-gray-500">
                CLASE {lesson.id}
              </h4>

              <span
                className={`
                  text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap sm:shadow-sm
                  ${lesson.status === "LOCKED" ? "bg-gray-200 text-gray-600" : ""}
                  ${lesson.status === "COMPLETED" ? "bg-green-200 text-green-800" : ""}
                  ${lesson.status === "IN_PROGRESS" ? "bg-yellow-200 text-yellow-800" : ""}
                  ${lesson.status === "AVAILABLE" ? "bg-blue-100 text-blue-700" : ""}
                `}
              >
                {statusLabels[lesson.status]}
              </span>
            </div>

            {/* Fila inferior: título */}
            <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-snug break-words">
              {lesson.title}
            </h3>
          </div>

          {/* DESCRIPCIÓN */}
          {lesson.description && (
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-gray-500 sm:line-clamp-2 sm:mt-0 sm:mb-3">
              {lesson.description}
            </p>
          )}

          {/* PROGRESO */}
          {lesson.status === "IN_PROGRESS" &&
            lesson.currentProgressPercent != null && (
              <div className="mt-3 sm:mb-3">
                <div className="flex justify-between text-[11px] sm:text-xs mb-1 sm:mb-1.5 font-medium text-yellow-800">
                  <span>Progreso</span>
                  <span>{lesson.currentProgressPercent}%</span>
                </div>

                <div className="h-2 sm:h-2.5 rounded-full bg-yellow-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-400 sm:bg-gradient-to-r sm:from-yellow-400 sm:to-yellow-500 transition-all duration-500 sm:duration-700"
                    style={{
                      width: `${lesson.currentProgressPercent}%`,
                    }}
                  />
                </div>
              </div>
            )}

          {/* COMPLETADA */}
          {lesson.status === "COMPLETED" && (
            <div className="flex items-center gap-4 mt-3 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Medal
                  size={15}
                  weight="fill"
                  className="sm:w-4 sm:h-4 sm:text-yellow-500"
                />
                <span className="sm:font-semibold">{lesson.bestScore}/100</span>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5">
                <Lightning
                  size={15}
                  weight="fill"
                  className="sm:w-4 sm:h-4 sm:text-blue-500"
                />
                <span className="sm:font-semibold">{lesson.totalXp} XP</span>
              </div>
            </div>
          )}

          {/* CTA */}
          {!isLocked && (
            <div className="mt-1 sm:mt-2 sm:-mb-1">
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-700 sm:text-blue-600 sm:bg-blue-50 sm:px-3 sm:py-1 sm:rounded-lg sm:transition-all sm:duration-300 sm:group-hover:bg-blue-100">
                <span>
                  {lesson.status === "IN_PROGRESS" ? "Continuar" : "Comenzar"}
                </span>
                <CaretRight size={14} weight="bold" className="sm:w-4 sm:h-4" />
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
