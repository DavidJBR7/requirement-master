// features/lessons/components/LessonResult.jsx
import { Link } from 'react-router-dom';
import Button from '../../../shared/components/Button';

export default function LessonResult({ result, onReset, onBackToRoadmap }) {
  return (
    <section aria-labelledby="result-heading" className="bg-white rounded-lg p-8 shadow-sm text-center space-y-4">
      <h2 id="result-heading" className="text-3xl font-bold">
        {result.passed ? '🎉 ¡Lección completada!' : '😞 No has aprobado'}
      </h2>
      <div className="text-lg">
        <p>Puntuación: <strong>{result.pointsObtained}/{result.totalPoints}</strong> ({result.percentScore}%)</p>
        <p>XP ganada: <strong>+{result.xpEarned} XP</strong></p>
        <p>Tiempo empleado: <strong>{Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s</strong></p>
        {!result.isExam && (
          <p className="text-sm text-gray-600 mt-2">
            Lecciones completadas: {result.lessonsCompletedCount}/5
          </p>
        )}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <Link to="/roadmap" onClick={onBackToRoadmap}>
          <Button>Volver al Roadmap</Button>
        </Link>
        <Button onClick={onReset} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
          Reiniciar lección
        </Button>
      </div>
    </section>
  );
}