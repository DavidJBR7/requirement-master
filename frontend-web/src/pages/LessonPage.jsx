import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useLessonDetail, useActivity, useSubmitAnswer, useFinalizeLesson, useResetLesson } from '../features/lessons/hooks/useLesson';
import TheoryView from '../features/lessons/components/TheoryView';
import ActivityFactory from '../features/lessons/components/ActivityFactory';
import LessonResult from '../features/lessons/components/LessonResult';
import Button from '../shared/components/Button';

export default function LessonPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const lessonId = Number(id);
  const shouldStartPractice = searchParams.get('start') === 'practice';

  const { data: lesson, isLoading, error } = useLessonDetail(lessonId);
  const submitAnswerMutation = useSubmitAnswer();
  const finalizeMutation = useFinalizeLesson();
  const resetMutation = useResetLesson();

  const [mode, setMode] = useState('theory');
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [showingResult, setShowingResult] = useState(false);

  const initializedRef = useRef(false);

  useEffect(() => {
    initializedRef.current = false;
    setResult(null);
    setShowingResult(false);
  }, [lessonId]);

  useEffect(() => {
    if (!lesson || showingResult) return;
    if (initializedRef.current) return;

    // Si se pidió iniciar en práctica y no está finalizada
    if (shouldStartPractice && !lesson.progress?.finalized) {
      setMode('practice');
      if (lesson.progress?.lastActivityOrder != null) {
        const idx = lesson.activities?.findIndex(a => a.orderIndex === lesson.progress.lastActivityOrder);
        setCurrentActivityIndex(idx >= 0 ? idx : 0);
      } else {
        setCurrentActivityIndex(0);
      }
      initializedRef.current = true;
      return;
    }

    if (lesson.progress?.finalized) {
      setMode('theory');
      setCurrentActivityIndex(0);
      initializedRef.current = true;
      return;
    }

    if (lesson.progress && (lesson.progress.completedActivities > 0 || lesson.progress.totalScore > 0)) {
      setMode('practice');
      if (lesson.progress.lastActivityOrder != null) {
        const idx = lesson.activities?.findIndex(a => a.orderIndex === lesson.progress.lastActivityOrder);
        setCurrentActivityIndex(idx >= 0 ? idx : 0);
      } else {
        setCurrentActivityIndex(0);
      }
    } else {
      setMode(shouldStartPractice ? 'practice' : 'theory');
      setCurrentActivityIndex(0);
    }

    initializedRef.current = true;
  }, [lesson, showingResult, shouldStartPractice]);

  const activities = lesson?.activities?.sort((a, b) => a.orderIndex - b.orderIndex) || [];
  const currentActivitySummary = activities[currentActivityIndex];
  const { data: currentActivity } = useActivity(currentActivitySummary?.id);

  const isFinalized = lesson?.progress?.finalized;

  const handleStartPractice = () => {
    if (isFinalized) return;
    setMode('practice');
    initializedRef.current = true;
  };

  const handleAnswer = useCallback(
    async (questionId, userAnswer) => {
      if (!currentActivitySummary) return null;
      try {
        const result = await submitAnswerMutation.submitAnswerAsync({
          activityId: currentActivitySummary.id,
          questionId,
          userAnswer,
          lessonId: lessonId,
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
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      handleFinalize();
    }
  };

  const handleFinalize = () => {
    if (isFinalized) return;
    finalizeMutation.mutate(lessonId, {
      onSuccess: (data) => {
        setResult(data);
        setMode('result');
        setShowingResult(true);
      },
    });
  };

  const handleReset = () => {
    resetMutation.mutate(lessonId, {
      onSuccess: () => {
        setResult(null);
        setMode('theory');
        setCurrentActivityIndex(0);
        setShowingResult(false);
        initializedRef.current = false;
      },
    });
  };

  const handleBackToRoadmap = () => {
    setShowingResult(false);
  };

  if (isLoading) return (
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

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-600">Error al cargar la lección.</p>
    </div>
  );

  if (!lesson) return null;

  if (mode === 'result' && result) {
    return <LessonResult result={result} onReset={handleReset} onBackToRoadmap={handleBackToRoadmap} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {mode === 'theory' && (
        <TheoryView
          lesson={lesson}
          onStartPractice={handleStartPractice}
          onReset={handleReset}
          practiceInProgress={!!lesson.progress && !isFinalized}
        />
      )}

      {mode === 'practice' && !isFinalized && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Práctica</h2>
            <Button
              onClick={() => setMode('theory')}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-sm"
            >
              ← Volver a teoría
            </Button>
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
              onClick={() => setCurrentActivityIndex(prev => Math.max(0, prev - 1))}
              disabled={currentActivityIndex === 0}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl"
            >
              ← Anterior
            </Button>
            {currentActivity?.currentProgress?.completed ? (
              <Button onClick={handleNextActivity} className="rounded-xl">
                {currentActivityIndex < activities.length - 1
                  ? 'Siguiente actividad →'
                  : 'Finalizar lección ✓'}
              </Button>
            ) : (
              <span className="text-sm text-gray-500 self-center">
                Respondé todas las preguntas para continuar
              </span>
            )}
          </div>
        </div>
      )}

      {mode === 'practice' && isFinalized && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <p className="text-yellow-800 mb-4">
            Esta lección ya fue finalizada. Para volver a practicar, debés reiniciarla.
          </p>
          <Button onClick={handleReset} className="bg-yellow-500 hover:bg-yellow-600 rounded-xl px-6 py-3">
            Reiniciar lección
          </Button>
        </div>
      )}
    </div>
  );
}