import { Link } from 'react-router-dom';

const statusLabels = {
  LOCKED: 'Bloqueada',
  AVAILABLE: 'Disponible',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
};

export default function RoadmapCard({ lesson }) {
  const isLocked = lesson.status === 'LOCKED';

  return (
    <article
      className={`rounded-lg border-2 p-4 ${
        isLocked
          ? 'border-gray-200 bg-gray-50 text-gray-400'
          : lesson.status === 'COMPLETED'
          ? 'border-green-200 bg-green-50'
          : lesson.status === 'IN_PROGRESS'
          ? 'border-yellow-200 bg-yellow-50'
          : 'border-blue-200 bg-white hover:shadow-md transition-shadow'
      }`}
      aria-disabled={isLocked}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{lesson.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            isLocked
              ? 'bg-gray-200 text-gray-500'
              : lesson.status === 'COMPLETED'
              ? 'bg-green-200 text-green-800'
              : lesson.status === 'IN_PROGRESS'
              ? 'bg-yellow-200 text-yellow-800'
              : 'bg-blue-200 text-blue-800'
          }`}
        >
          {statusLabels[lesson.status]}
        </span>
      </div>

      {lesson.status === 'IN_PROGRESS' && lesson.currentProgressPercent != null && (
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progreso</span>
            <span>{lesson.currentProgressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${lesson.currentProgressPercent}%` }}
            />
          </div>
        </div>
      )}

      {lesson.status === 'COMPLETED' && (
        <div className="text-sm space-y-1 mb-3">
          <p>Mejor puntuación: {lesson.bestScore}/100</p>
          <p>XP total: {lesson.totalXp}</p>
        </div>
      )}

      {!isLocked ? (
        <Link
          to={`/lessons/${lesson.id}`}
          className="inline-block mt-2 text-blue-600 hover:underline font-medium text-sm"
          aria-label={`Ir a la lección ${lesson.title}`}
        >
          {lesson.status === 'IN_PROGRESS' ? 'Continuar' : 'Empezar'}
        </Link>
      ) : (
        <span className="inline-block mt-2 text-gray-400 text-sm">🔒 Bloqueada</span>
      )}
    </article>
  );
}