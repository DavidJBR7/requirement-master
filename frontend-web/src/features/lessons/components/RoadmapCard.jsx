const statusLabels = {
  LOCKED: 'Bloqueada',
  AVAILABLE: 'Disponible',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
};

const statusIcons = {
  LOCKED: 'fas fa-lock',
  AVAILABLE: 'fas fa-book',
  IN_PROGRESS: 'fas fa-book-open',
  COMPLETED: 'fas fa-square-check',
};

export default function RoadmapCard({ lesson, onStart }) {
  const isLocked = lesson.status === 'LOCKED';

  const bgClass = isLocked
    ? 'bg-gray-50 border-gray-200'
    : lesson.status === 'COMPLETED'
    ? 'bg-green-50 border-green-200'
    : lesson.status === 'IN_PROGRESS'
    ? 'bg-yellow-50 border-yellow-200'
    : 'bg-white border-blue-200 hover:shadow-lg hover:border-blue-300';

  const statusBadgeClass = isLocked
    ? 'bg-gray-200 text-gray-600'
    : lesson.status === 'COMPLETED'
    ? 'bg-green-200 text-green-800'
    : lesson.status === 'IN_PROGRESS'
    ? 'bg-yellow-200 text-yellow-800'
    : 'bg-blue-100 text-blue-700';

  return (
<article
  className={`rounded-2xl border-2 p-6 transition-all duration-300 group ${
    !isLocked 
      ? `cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 ${bgClass}` 
      : `${bgClass}`
  } ${
    isLocked ? 'opacity-60' : ''
  }`}
  aria-disabled={isLocked}
  onClick={() => !isLocked && onStart?.()}
>
  <div className="flex items-center gap-5">
    {/* Ícono de estado - ahora más grande y con fondo */}
    <div className={`
      flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl
      transition-transform duration-300 group-hover:scale-110
      ${lesson.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : ''}
      ${lesson.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-600' : ''}
      ${lesson.status === 'LOCKED' ? 'bg-gray-100 text-gray-400' : ''}
      ${!lesson.status || lesson.status === 'NOT_STARTED' ? 'bg-blue-100 text-blue-600' : ''}
    `}>
      <i className={`${statusIcons[lesson.status]}`} aria-hidden="true"></i>
    </div>

    {/* Contenido principal */}
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {lesson.title}
        </h3>
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${statusBadgeClass} shadow-sm flex-shrink-0`}>
          {statusLabels[lesson.status]}
        </span>
      </div>

      {lesson.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {lesson.description}
        </p>
      )}

      {/* Barra de progreso - ahora más estilizada */}
      {lesson.status === 'IN_PROGRESS' && lesson.currentProgressPercent != null && (
        <div className="mb-3">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-yellow-700">En progreso</span>
            <span className="text-yellow-700">{lesson.currentProgressPercent}%</span>
          </div>
          <div className="w-full bg-yellow-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${lesson.currentProgressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Info de completada */}
      {lesson.status === 'COMPLETED' && (
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <i className="fas fa-medal text-yellow-500"></i>
            <span className="font-semibold">{lesson.bestScore}/100</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fas fa-bolt text-blue-500"></i>
            <span className="font-semibold">{lesson.totalXp} XP</span>
          </div>
        </div>
      )}

      {/* Flecha para comenzar */}
      {!isLocked && (
        <div className="mt-2 -mb-1">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg transition-all duration-300 group-hover:bg-blue-100">
            {lesson.status === 'IN_PROGRESS' ? 'Continuar aprendizaje' : 'Comenzar lección'}
            <svg className="w-4 h-4 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      )}
    </div>
  </div>
</article>
  );
}