// features/lessons/components/TheoryView.jsx
import Button from '../../../shared/components/Button';
import { lessonTheoryMap } from '../data/lessonTheory';

export default function TheoryView({ lesson, onStartPractice, onReset, practiceInProgress }) {
  const theoryContent =
    lessonTheoryMap[lesson.id] ||
    `<p>Contenido teórico no disponible aún para esta lección.</p>`;

  const isFinalized = lesson.progress?.finalized;

  return (
    <section aria-labelledby="theory-heading" className="space-y-6">
      <h2 id="theory-heading" className="text-2xl font-bold">
        {lesson.title}
      </h2>
      <div
        className="prose max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: theoryContent }}
      />

      {isFinalized && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
          Esta lección ya fue finalizada. Para volver a intentarlo debes reiniciarla.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {!isFinalized && (
          <Button onClick={onStartPractice} className="w-full sm:w-auto">
            {practiceInProgress ? 'Continuar práctica' : 'Comenzar práctica'}
          </Button>
        )}
        {isFinalized && (
          <Button onClick={onReset} className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600">
            Reiniciar lección
          </Button>
        )}
        {/* También se podría añadir un botón de reset adicional aunque no esté finalizada, si se desea. */}
      </div>
    </section>
  );
};