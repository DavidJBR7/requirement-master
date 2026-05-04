import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useLessonDetail, useActivity, useSubmitAnswer, useFinalizeLesson, useResetLesson } from '../features/lessons/hooks/useLesson';
import TheoryView from '../features/lessons/components/TheoryView';
import ActivityFactory from '../features/lessons/components/ActivityFactory';
import LessonResult from '../features/lessons/components/LessonResult';
import Button from '../shared/components/Button';

export default function LessonPage() {
  const { id } = useParams();
  const lessonId = Number(id);
  const { data: lesson, isLoading, error } = useLessonDetail(lessonId);
  const submitAnswerMutation = useSubmitAnswer();
  const finalizeMutation = useFinalizeLesson();
  const resetMutation = useResetLesson();

  const [mode, setMode] = useState('theory'); // 'theory' | 'practice' | 'result'
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [result, setResult] = useState(null);

  // Reiniciar estado al cambiar de lección
  useEffect(() => {
    setMode('theory');
    setCurrentActivityIndex(0);
    setResult(null);
  }, [lessonId]);

  // Determinar si hay práctica en progreso y desde dónde continuar
  useEffect(() => {
    if (lesson && lesson.progress && !lesson.progress.finalized && mode !== 'result') {
      if (lesson.progress.lastActivityOrder != null) {
        const idx = lesson.activities.findIndex(a => a.orderIndex === lesson.progress.lastActivityOrder);
        setCurrentActivityIndex(idx >= 0 ? idx : 0);
      }
    }
  }, [lesson, mode]);

  const activities = lesson?.activities?.sort((a, b) => a.orderIndex - b.orderIndex) || [];
  const currentActivitySummary = activities[currentActivityIndex];
  const { data: currentActivity } = useActivity(currentActivitySummary?.id, {
    enabled: mode === 'practice' && !!currentActivitySummary,
  });

  const handleStartPractice = () => {
    setMode('practice');
  };

  const handleAnswer = useCallback(
    (questionId, userAnswer) => {
      if (!currentActivitySummary) return;
      submitAnswerMutation.mutate(
        {
          activityId: currentActivitySummary.id,
          questionId,
          userAnswer,
          // timeSpentSeconds se podría añadir
        },
        {
          onSuccess: (response) => {
            // La actividad se recargará automáticamente debido a la invalidación en useSubmitAnswer
          },
        }
      );
    },
    [currentActivitySummary, submitAnswerMutation]
  );

  const handleNextActivity = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      // Todas las actividades completadas, ofrecer finalizar
      finalizeMutation.mutate(lessonId, {
        onSuccess: (data) => {
          setResult(data);
          setMode('result');
        },
      });
    }
  };

  const handleFinalize = () => {
    finalizeMutation.mutate(lessonId, {
      onSuccess: (data) => {
        setResult(data);
        setMode('result');
      },
    });
  };

  const handleReset = () => {
    resetMutation.mutate(lessonId, {
      onSuccess: () => {
        setResult(null);
        setMode('theory');
        setCurrentActivityIndex(0);
      },
    });
  };

  if (isLoading) return <div className="p-8 text-center">Cargando lección...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error al cargar la lección.</div>;
  if (!lesson) return null;

  if (mode === 'result' && result) {
    return <LessonResult result={result} onReset={handleReset} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {mode === 'theory' && (
        <TheoryView
          lesson={lesson}
          onStartPractice={handleStartPractice}
          practiceInProgress={!!lesson.progress && !lesson.progress.finalized}
        />
      )}

      {mode === 'practice' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Práctica</h2>
            <Button
              variant="secondary"
              onClick={() => setMode('theory')}
              className="text-sm"
            >
              Volver a teoría
            </Button>
          </div>

          {/* Barras de progreso */}
          {lesson.progress && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Actividades completadas</span>
                  <span>
                    {lesson.progress.completedActivities}/{lesson.progress.totalActivities}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
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
                <div className="flex justify-between text-sm mb-1">
                  <span>Puntuación actual</span>
                  <span>
                    {lesson.progress.totalScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      lesson.progress.totalScore >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${lesson.progress.totalScore}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Meta: 70% para aprobar
                </p>
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

          {/* Navegación */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setCurrentActivityIndex(prev => Math.max(0, prev - 1))}
              disabled={currentActivityIndex === 0}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Anterior
            </Button>
            {currentActivity?.currentProgress?.completed ? (
              <Button onClick={handleNextActivity}>
                {currentActivityIndex < activities.length - 1
                  ? 'Siguiente actividad'
                  : 'Finalizar lección'}
              </Button>
            ) : (
              <span className="text-sm text-gray-500 self-center">
                Responde todas las preguntas para continuar
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}