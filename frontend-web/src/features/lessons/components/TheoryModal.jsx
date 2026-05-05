import { useNavigate } from 'react-router-dom';
import Modal from '../../../shared/components/Modal';
import TheoryView from './TheoryView';
import { useLessonDetail } from '../hooks/useLesson';

export default function TheoryModal({ lessonId, isOpen, onClose }) {
  const navigate = useNavigate();
  const { data: lesson, isLoading, error } = useLessonDetail(lessonId, {
    enabled: isOpen && !!lessonId,
  });

  const handleStartPractice = () => {
    onClose();
    navigate(`/lessons/${lessonId}?start=practice`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-500">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Cargando teoría...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">Error al cargar la lección. Intentá nuevamente.</p>
          <button onClick={onClose} className="mt-4 text-blue-600 hover:underline">Cerrar</button>
        </div>
      )}

      {lesson && (
        <TheoryView
          lesson={lesson}
          onStartPractice={handleStartPractice}
          onReset={() => {}}
          practiceInProgress={!!lesson.progress && !lesson.progress?.finalized}
          isInModal={true}
        />
      )}
    </Modal>
  );
}