import { useState, useEffect } from "react";
import { Trophy, Path } from "@phosphor-icons/react";

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
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Cargando roadmap...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-red-600">
          Error al cargar el roadmap. Intenta nuevamente.
        </p>
      </div>
    );
  }

  const sortedLessons = lessons
    ? [...lessons].sort((a, b) => a.orderIndex - b.orderIndex)
    : [];

  return (
    <>
      <section className="w-full max-w-3xl mx-auto p-6 lg:p-8">
        {/* HERO */}
        <div className="pt-4 mb-5">
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-5 shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur">
                  <Path size={22} weight="bold" className="text-white" />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-widest text-blue-200 font-semibold">
                    Tu viaje comienza aquí
                  </p>

                  <h1 className="text-xl font-black text-white leading-tight">
                    Requirement Master
                  </h1>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-blue-100">
                Este es el camino para convertirte en el mejor levantador de
                requerimientos.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-blue-100">
                <Trophy size={16} weight="fill" />
                <span>Completa lecciones y gana experiencia</span>
              </div>
            </div>
          </div>
        </div>

        {/* LECCIONES */}
        <div className="space-y-3 pb-4">
          {sortedLessons.map((lesson) => (
            <RoadmapCard
              key={lesson.id}
              lesson={lesson}
              onStart={() => handleOpenLesson(lesson.id)}
            />
          ))}
        </div>
      </section>

      <TheoryModal
        lessonId={selectedLessonId}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        lessonData={lessons?.find((l) => l.id === selectedLessonId)}
      />
    </>
  );
}
