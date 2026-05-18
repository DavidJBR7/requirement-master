import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  useLessonDetail,
  useActivity,
  useSubmitAnswer,
  useFinalizeLesson,
  useResetLesson,
} from "../features/lessons/hooks/useLesson";
import ActivityFactory from "../features/lessons/components/ActivityFactory";
import LessonResult from "../features/lessons/components/LessonResult";
import Button from "../shared/components/Button";
import { X, Info } from "@phosphor-icons/react";

export default function LessonPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lessonId = Number(id);
  const shouldStartPractice = searchParams.get("start") === "practice";

  useEffect(() => {
    if (!shouldStartPractice) {
      navigate("/roadmap", { replace: true });
    }
  }, [shouldStartPractice, navigate]);

  const {
    data: lesson,
    isLoading,
    error,
  } = useLessonDetail(lessonId, {
    enabled: !!lessonId && shouldStartPractice,
  });
  const submitAnswerMutation = useSubmitAnswer();
  const finalizeMutation = useFinalizeLesson();
  const resetMutation = useResetLesson();

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [showingResult, setShowingResult] = useState(false);

  const justFinalized = useRef(false);

  const completed = lesson.progress?.completedActivities ?? 0;
  const total = lesson.progress?.totalActivities ?? 1;
  const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;

  useEffect(() => {
    if (
      lesson?.progress?.finalized &&
      shouldStartPractice &&
      !justFinalized.current
    ) {
      navigate("/roadmap", { replace: true });
    }
    if (justFinalized.current) {
      justFinalized.current = false;
    }
  }, [lesson, shouldStartPractice, navigate]);

  const activities =
    lesson?.activities?.sort((a, b) => a.orderIndex - b.orderIndex) || [];
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
        console.error("Falló el envío de la respuesta:", error);
        throw error;
      }
    },
    [currentActivitySummary, submitAnswerMutation.submitAnswerAsync, lessonId],
  );

  const handleNextActivity = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex((prev) => prev + 1);
    } else {
      handleFinalize();
    }
  };

  const handleFinalize = () => {
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
        justFinalized.current = false;
      },
    });
  };

  const handleBackToRoadmap = () => {
    navigate("/roadmap");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-500">
          <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
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

  if (showingResult && result) {
    return (
      <LessonResult
        result={result}
        onReset={handleReset}
        onBackToRoadmap={handleBackToRoadmap}
      />
    );
  }

  return (
    <main className="min-h-screen">
      {/* Fondo decorativo */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-[420px] h-[420px] bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[320px] h-[320px] bg-cyan-100 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
            {/* izquierda */}
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={handleBackToRoadmap}
                className="
                w-11 h-11 rounded-2xl
                bg-brand-gradient
                flex items-center justify-center
                transition-all duration-200
                shadow-sm
                cursor-pointer
              "
                aria-label="Volver al roadmap"
              >
                <X
                  size={20}
                  weight="bold"
                  className="text-slate-100"
                  aria-hidden="true"
                />
              </button>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold">
                  Modo práctica
                </p>

                <h1 className="text-base md:text-lg font-bold text-slate-900 truncate">
                  Clase {lesson.id} · {lesson.title}
                </h1>
              </div>
            </div>

            {/* derecha */}
            <div className="flex items-center gap-2 md:gap-6">
              {/* MOBILE */}
              <div className="flex lg:hidden items-center gap-2">
                {/* progreso */}
                <div className="min-w-[92px] rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Progreso
                    </span>

                    <span className="text-[11px] font-bold text-blue-600">
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="
                      h-full rounded-full
                      bg-gradient-to-r
                      from-blue-600
                      to-blue-400
                      transition-all duration-500
                    "
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* score */}
                <div className="min-w-[92px] rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Score
                    </span>

                    <span
                      className={`
                      text-[11px] font-bold
                      ${
                        lesson.progress?.totalScore >= 70
                          ? "text-emerald-600"
                          : "text-orange-500"
                      }
                    `}
                    >
                      {lesson.progress?.totalScore || 0}
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`
                      h-full rounded-full transition-all duration-500
                      ${
                        lesson.progress?.totalScore >= 70
                          ? "bg-gradient-to-r from-emerald-500 to-green-400"
                          : "bg-gradient-to-r from-yellow-400 to-orange-400"
                      }
                    `}
                      style={{
                        width: `${lesson.progress?.totalScore || 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* DESKTOP */}
              <div className="hidden lg:flex items-center gap-6">
                {/* progreso */}
                <div className="w-52">
                  <div className="flex justify-between text-xs mb-1 text-slate-500">
                    <span>Progreso</span>
                    <span className="font-bold">{percentage}%</span>
                  </div>

                  <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="
                      h-full rounded-full
                      bg-gradient-to-r
                      from-blue-600
                      to-blue-400
                      transition-all duration-500
                    "
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* score */}
                <div className="w-52">
                  <div className="flex justify-between text-xs mb-1 text-slate-500">
                    <div className="flex items-center gap-1">
                      <span>Puntuación</span>

                      <div className="relative group">
                        <Info
                          size={14}
                          className="text-slate-500 cursor-help"
                          aria-label="Información sobre puntuación"
                        />

                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          Necesitas 70% para aprobar
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                        </div>
                      </div>
                    </div>

                    <span className="font-bold">
                      {lesson.progress?.totalScore || 0}/100
                    </span>
                  </div>

                  <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`
                      h-full rounded-full
                      ${
                        lesson.progress?.totalScore >= 70
                          ? "bg-gradient-to-r from-emerald-500 to-green-400"
                          : "bg-gradient-to-r from-yellow-400 to-orange-400"
                      }
                    `}
                      style={{
                        width: `${lesson.progress?.totalScore || 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div>
              {/* CONTENIDO */}
              <section
                className="
                min-w-0
                min-h-[720px]
                bg-white
                rounded-[32px]
                border border-slate-200
                shadow-sm
                overflow-hidden
                flex flex-col
              "
                aria-labelledby="activity-title"
              >
                {/* header actividad */}
                <header className="border-b border-slate-100 px-5 py-2 md:px-8">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2
                      id="activity-title"
                      className="text-sm uppercase tracking-[0.2em] text-blue-600 font-semibold flex-1 min-w-[120px] break-words"
                    >
                      Actividad{" "}
                      {currentActivity?.title || `${currentActivityIndex + 1}`}
                    </h2>

                    <div
                      className="
                      px-2 md:px-4 py-2 rounded-2xl
                      bg-brand-gradient
                      text-sm font-medium text-slate-100
                      whitespace-nowrap
                    "
                      aria-label={`Actividad ${currentActivityIndex + 1} de ${activities.length}`}
                    >
                      {currentActivityIndex + 1} de {activities.length}
                    </div>
                  </div>
                </header>

                {/* BODY */}
                <div className="flex-1 overflow-x-auto">
                  {currentActivity && (
                    <ActivityFactory
                      activity={currentActivity}
                      onAnswer={handleAnswer}
                    />
                  )}
                </div>

                {/* FOOTER */}
                <footer className="border-t border-slate-100 px-4 py-4 flex items-center justify-center">
                  {currentActivity?.currentProgress?.completed ? (
                    <Button
                      onClick={handleNextActivity}
                      className="
                      px-10
                      bg-gradient-to-r
                      from-blue-600
                      to-cyan-500
                      text-white
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      transition-all
                      !rounded-2xl
                    "
                    >
                      {currentActivityIndex < activities.length - 1
                        ? "Continuar"
                        : "Finalizar"}
                    </Button>
                  ) : (
                    <div className="flex items-center text-sm text-slate-400 px-2">
                      Completa la actividad para continuar
                    </div>
                  )}
                </footer>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
