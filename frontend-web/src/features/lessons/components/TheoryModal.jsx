// features/lessons/components/TheoryModal.jsx
import { useNavigate } from 'react-router-dom';
import Modal from '../../../shared/components/Modal';
import TheoryView from './TheoryView';
import { useLessonDetail, useResetLesson } from '../hooks/useLesson'; // Añade useResetLesson
import Button from '../../../shared/components/Button'; // Opcional si quieres mostrar loading

export default function TheoryModal({ lessonId, isOpen, onClose }) {
  const navigate = useNavigate();
  const { data: lesson, isLoading, error } = useLessonDetail(lessonId, {
    enabled: isOpen && !!lessonId,
  });
  const resetMutation = useResetLesson(); // ← Hook de reinicio

  const handleStartPractice = () => {
    onClose();
    navigate(`/lessons/${lessonId}?start=practice`);
  };

  const handleReset = () => {
    resetMutation.mutate(lessonId, {
      onSuccess: () => {
        onClose(); // Cierra el modal tras reiniciar
      },
      // Podrías agregar onError para mostrar un mensaje
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {/* ... manejo de carga y error ... */}
      {lesson && (
        <TheoryView
          lesson={lesson}
          onStartPractice={handleStartPractice}
          onReset={handleReset}  // ← Ahora ejecuta el reinicio real
          practiceInProgress={!!lesson.progress && !lesson.progress?.finalized}
          isInModal={true}
        />
      )}
    </Modal>
  );
}