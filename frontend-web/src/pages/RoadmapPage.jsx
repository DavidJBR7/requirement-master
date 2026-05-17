import { useState, useEffect } from "react";
import { useRoadmap } from "../features/lessons/hooks/useLesson";
import RoadmapCard from "../features/lessons/components/RoadmapCard";
import TheoryModal from "../features/lessons/components/TheoryModal";

export default function RoadmapPage() {
  const { data: lessons, isLoading, error } = useRoadmap();

  useEffect(() => {
    if (lessons) {
      console.log("Datos del roadmap:", lessons);
    }
  }, [lessons]);

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLessonId(null);
  };

  if (isLoading)
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
          <span>Cargando roadmap...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20">
        <p className="text-red-600">
          Error al cargar el roadmap. Intenta nuevamente.
        </p>
      </div>
    );

  const sortedLessons = lessons
    ? [...lessons].sort((a, b) => a.orderIndex - b.orderIndex)
    : [];

  return (
    <section
      aria-labelledby="roadmap-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Título principal - full width */}
      <div className="text-center mb-10">
        <h1
          id="roadmap-heading"
          className="text-4xl sm:text-5xl font-extrabold mb-4 pb-4 tracking-tight border-b-2 border-blue-600 text-brand-gradient"
        >
          RUTA DE REQUIREMENT MASTER
        </h1>
      </div>

      {/* Layout de dos columnas */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna izquierda - Roadmap Cards */}
        <main className="lg:w-5/7 xl:w-5/7 flex-1 bg-blue-50 rounded-2xl shadow-md p-8 border border-gray-100">
          <div className="space-y-4">
            {sortedLessons.map((lesson) => (
              <RoadmapCard
                key={lesson.id}
                lesson={lesson}
                onStart={() => handleOpenLesson(lesson.id)}
              />
            ))}
          </div>
        </main>

        {/* Columna derecha - Informativa/Persuasiva */}
        <aside className="lg:w-2/7 xl:w-2/7 flex-shrink-0">
          <div className="bg-blue-50 rounded-2xl shadow-md p-8 border border-gray-100 sticky top-8">
            <div className="space-y-6">
              {/* Badge decorativo */}
              <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
                Tu viaje comienza aquí
              </div>

              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                Este es el camino para convertirte en el mejor levantador de
                requerimientos
              </h2>

              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Cada paso está diseñado para llevarte del{" "}
                  <span className="font-semibold text-gray-900">
                    no sé por dónde empezar
                  </span>{" "}
                  al{" "}
                  <span className="font-semibold text-gray-900">
                    dominio total
                  </span>{" "}
                  de las técnicas de elicitación, análisis y documentación de
                  requerimientos.
                </p>

                <p className="leading-relaxed">
                  No importa si estás empezando desde cero o si ya tienes
                  experiencia: esta ruta te guiará de manera progresiva,
                  asegurando que cada concepto quede sólido antes de avanzar al
                  siguiente nivel.
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    ¿Qué lograrás?
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>
                        Dominar entrevistas efectivas con stakeholders
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Crear documentos de requerimientos impecables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Evitar los errores más comunes del rol</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Gestionar expectativas como un profesional</span>
                    </li>
                  </ul>
                </div>

                {/* Call to action sutil */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-800 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-blue-100 font-medium">
                    💡 <span className="font-semibold">Tip:</span> Tómate tu
                    tiempo en cada lección. La práctica constante es la clave
                    del dominio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal de teoría */}
      <TheoryModal
        lessonId={selectedLessonId}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
