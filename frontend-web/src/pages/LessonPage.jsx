import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  useLessonDetail,
  useActivity,
  useSubmitAnswer,
  useFinalizeLesson,
  useResetLesson,
} from '../features/lessons/hooks/useLesson';
import ActivityFactory from '../features/lessons/components/ActivityFactory';
import LessonResult from '../features/lessons/components/LessonResult';
import Button from '../shared/components/Button';

export default function LessonPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lessonId = Number(id);
  const shouldStartPractice = searchParams.get('start') === 'practice';

  // Redirigir si se accede sin el parámetro obligatorio
  useEffect(() => {
    if (!shouldStartPractice) {
      navigate('/roadmap', { replace: true });
    }
  }, [shouldStartPractice, navigate]);

  const { data: lesson, isLoading, error } = useLessonDetail(lessonId, {
    enabled: !!lessonId && shouldStartPractice,
  });
  const submitAnswerMutation = useSubmitAnswer();
  const finalizeMutation = useFinalizeLesson();
  const resetMutation = useResetLesson();

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [showingResult, setShowingResult] = useState(false);

  // Bandera para evitar redirección automática justo después de finalizar
  const justFinalized = useRef(false);

  // Redirigir SOLO si la lección ya estaba finalizada antes de entrar (no si acaba de finalizar)
  useEffect(() => {
    if (lesson?.progress?.finalized && shouldStartPractice && !justFinalized.current) {
      navigate('/roadmap', { replace: true });
    }
    // Después de la comprobación, resetear la bandera
    if (justFinalized.current) {
      justFinalized.current = false;
    }
  }, [lesson, shouldStartPractice, navigate]);

  const activities = lesson?.activities?.sort((a, b) => a.orderIndex - b.orderIndex) || [];
  const currentActivitySummary = activities[currentActivityIndex];
  const { data: currentActivity } = useActivity(currentActivitySummary?.id, {
    enabled: !!currentActivitySummary?.id,
  });

  const handleAnswer = useCallback(
    async (questionId, userAnswer) => {
      if (!currentActivitySummary) return null;
      try {
        const result = await submitAnswerMutation.submitAnswerAsync({
          activityId: currentActivitySummary.id,
          questionId,
          userAnswer,
          lessonId,
        });
        return result;
      } catch (error) {
        console.error('Falló el envío de la respuesta:', error);
        throw error;
      }
    },
    [currentActivitySummary, submitAnswerMutation.submitAnswerAsync, lessonId]
  );

  const handleNextActivity = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex((prev) => prev + 1);
    } else {
      handleFinalize();
    }
  };

  const handleFinalize = () => {
    // Activar bandera para que el efecto no redirija automáticamente
    justFinalized.current = true;
    finalizeMutation.mutate(lessonId, {
      onSuccess: (data) => {
        setResult(data);
        setShowingResult(true);
      },
    });
  };

  const handleReset = () => {
    resetMutation.mutate(lessonId, {
      onSuccess: () => {
        setResult(null);
        setCurrentActivityIndex(0);
        setShowingResult(false);
        justFinalized.current = false; // limpieza extra
      },
    });
  };

  const handleBackToRoadmap = () => {
    navigate('/roadmap');
  };

  // --- Estados de carga y error ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Cargando lección...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Error al cargar la lección.</p>
      </div>
    );
  }

  if (!lesson) return null;

  // Mostrar resultado final si se ha terminado
  if (showingResult && result) {
    return (
      <LessonResult
        result={result}
        onReset={handleReset}
        onBackToRoadmap={handleBackToRoadmap}
      />
    );
  }

  // Modo práctica (único disponible en esta página)
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Práctica</h2>
      </div>

      {/* Barras de progreso */}
      {lesson.progress && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="flex justify-between text-sm mb-1 text-gray-700">
              <span>Actividades completadas</span>
              <span className="font-medium">
                {lesson.progress.completedActivities}/{lesson.progress.totalActivities}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    lesson.progress.totalActivities > 0
                      ? (lesson.progress.completedActivities / lesson.progress.totalActivities) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1 text-gray-700">
              <span>Puntuación actual</span>
              <span className="font-medium">{lesson.progress.totalScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  lesson.progress.totalScore >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${lesson.progress.totalScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Meta: 70% para aprobar</p>
          </div>
        </div>
      )}

      {/* Actividad actual */}
      {currentActivity && (
        <ActivityFactory
          activity={currentActivity}
          onAnswer={handleAnswer}
        />
      )}

      {/* Navegación entre actividades */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={() => setCurrentActivityIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentActivityIndex === 0}
          className="rounded-xl"
        >
          ← Anterior
        </Button>
        {currentActivity?.currentProgress?.completed ? (
          <Button onClick={handleNextActivity} className="rounded-xl">
            {currentActivityIndex < activities.length - 1
              ? 'Siguiente actividad →'
              : 'Finalizar lección'}
          </Button>
        ) : (
          <span className="text-sm text-gray-500 self-center">
            Responde todas las preguntas para continuar
          </span>
        )}
      </div>
    </div>
  );
}