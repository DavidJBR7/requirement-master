import Button from '../../../shared/components/Button';
import { lessonTheoryMap } from '../data/lessonTheory';

export default function TheoryView({
  lesson,
  onStartPractice,
  onReset,
  practiceInProgress,
  isInModal = false,
  isResetting = false,           // nueva prop
}) {
  const theoryContent =
    lessonTheoryMap[lesson.id] ||
    `<p>Contenido teórico no disponible aún para esta lección.</p>`;

  const isFinalized = lesson.progress?.finalized;

  return (
    <section aria-labelledby="theory-heading" className="space-y-6">
      <h2 id="theory-heading" className="text-2xl font-bold text-gray-900">
        {lesson.title}
      </h2>
      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: theoryContent }}
      />

      {isFinalized && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          Esta lección ya fue finalizada. Para volver a intentarlo debes reiniciarla.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {!isFinalized && (
          <Button onClick={onStartPractice} className="w-full sm:w-auto rounded-xl px-6 py-3">
            {practiceInProgress ? 'Continuar práctica' : 'Comenzar práctica'}
          </Button>
        )}
        {isFinalized && onReset && (
          <Button
            onClick={onReset}
            isLoading={isResetting}     // añadir esta línea
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 rounded-xl px-6 py-3"
          >
            Reiniciar lección
          </Button>
        )}
      </div>
    </section>
  );
}