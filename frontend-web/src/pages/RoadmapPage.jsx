import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Path, BookOpen, Lightning } from "@phosphor-icons/react";

import { useRoadmap } from "../features/lessons/hooks/useLesson";
import RoadmapCard from "../features/lessons/components/RoadmapCard";
import TheoryModal from "../features/lessons/components/TheoryModal";

export default function RoadmapPage() {
  const { data: lessons, isLoading, error } = useRoadmap();

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (lessons) {
      console.log("Datos del roadmap:", lessons);
    }
  }, [lessons]);

  const handleOpenLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLessonId(null);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f4f8fc] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <figure className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
              <BookOpen
                size={32}
                weight="fill"
                className="text-blue-600 animate-bounce"
                aria-hidden="true"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 border-[3px] border-[#f4f8fc] flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <figcaption className="sr-only">
              Cargando contenido del roadmap
            </figcaption>
          </figure>
          <p className="text-slate-500 font-medium text-sm">
            Cargando roadmap...
          </p>
        </motion.div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f4f8fc] flex items-center justify-center p-4">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-red-100 text-center max-w-sm"
          role="alert"
        >
          <header>
            <figure className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Lightning
                size={28}
                weight="fill"
                className="text-red-500"
                aria-hidden="true"
              />
              <figcaption className="sr-only">Icono de error</figcaption>
            </figure>
            <h2 className="text-lg font-black text-slate-900 mb-2">
              ¡Ups! Algo salió mal
            </h2>
          </header>
          <p className="text-slate-500 text-sm mb-5">
            No pudimos cargar el roadmap. Intenta nuevamente.
          </p>
          <footer>
            <button
              onClick={() => window.location.reload()}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Reintentar
            </button>
          </footer>
        </motion.article>
      </main>
    );
  }

  const sortedLessons = lessons
    ? [...lessons].sort((a, b) => a.orderIndex - b.orderIndex)
    : [];

  const completedCount = sortedLessons.filter(
    (l) => l.status == "COMPLETED",
  ).length;
  const totalCount = sortedLessons.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <>
      <main className="min-h-screen">
        <article className="w-full max-w-3xl mx-auto p-6 lg:p-8">
          <header className="pt-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative overflow-hidden rounded-[34px] bg-brand-gradient p-6 shadow-[0_15px_60px_rgba(37,99,235,0.25)]">
                <div
                  className="absolute top-[-60px] right-[-60px] w-48 h-48 bg-white/10 rounded-full blur-3xl"
                  aria-hidden="true"
                />
                <div
                  className="absolute bottom-[-40px] left-[-40px] w-36 h-36 bg-cyan-400/20 rounded-full blur-2xl"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <motion.figure
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2,
                      }}
                      className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-lg"
                    >
                      <Path
                        size={26}
                        weight="bold"
                        className="text-white"
                        aria-hidden="true"
                      />
                      <figcaption className="sr-only">
                        Icono de ruta de aprendizaje
                      </figcaption>
                    </motion.figure>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] text-blue-200 font-semibold">
                        Tu viaje comienza aquí
                      </p>
                      <h1 className="text-2xl font-black text-white leading-tight">
                        Requirement Master
                      </h1>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-blue-100 mb-5">
                    Este es el camino para convertirte en el mejor levantador de
                    requerimientos. Completa cada lección para avanzar.
                  </p>

                  <section
                    className="space-y-2"
                    aria-label="Progreso del roadmap"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-blue-100">
                        <Trophy size={16} weight="fill" aria-hidden="true" />
                        <span>
                          {completedCount} de {totalCount} lecciones
                        </span>
                      </div>
                      <span className="font-bold text-white">
                        {progressPercentage}%
                      </span>
                    </div>

                    <div
                      className="h-2 rounded-full bg-white/15 backdrop-blur-sm overflow-hidden"
                      role="progressbar"
                      aria-valuenow={progressPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progreso del roadmap: ${progressPercentage}% completado`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.5,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-white/80 to-white shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                      />
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </header>

          <section aria-label="Lista de lecciones" className="space-y-4 pb-8">
            <AnimatePresence mode="popLayout">
              {sortedLessons.map((lesson, index) => (
                <motion.article
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  layout
                >
                  {index > 0 && (
                    <div
                      className="flex justify-center -mb-2"
                      aria-hidden="true"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 16 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                        className="w-0.5 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full"
                      />
                    </div>
                  )}

                  <RoadmapCard
                    lesson={lesson}
                    onStart={() => handleOpenLesson(lesson.id)}
                  />
                </motion.article>
              ))}
            </AnimatePresence>
          </section>
        </article>
      </main>

      <TheoryModal
        lessonId={selectedLessonId}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        lessonData={lessons?.find((l) => l.id === selectedLessonId)}
      />
    </>
  );
}
