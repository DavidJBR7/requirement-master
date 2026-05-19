import { useNavigate } from "react-router-dom";
import Modal from "../../../shared/components/Modal";
import TheoryView from "./TheoryView";
import { useResetLesson } from "../hooks/useLesson";

export default function TheoryModal({ lessonId, isOpen, onClose, lessonData }) {
  const navigate = useNavigate();

  const resetMutation = useResetLesson();

  const lesson = lessonData
    ? {
        id: lessonData.id,
        title: lessonData.title,
        finalized: lessonData.status === "COMPLETED",
        progress: {
          finalized: lessonData.status === "COMPLETED",
        },
      }
    : null;

  const handleStartPractice = () => {
    onClose();
    navigate(`/lessons/${lessonId}?start=practice`);
  };

  const handleReset = () => {
    resetMutation.mutate(lessonId, {
      // No cerramos el modal; al invalidarse las queries se mostrará la lección reiniciada
      onError: (error) => {
        console.error("Error al reiniciar la lección:", error);
      },
    });
  };

  if (!isOpen) return null;

  if (!lessonData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="text-center py-12">
          <p className="text-red-600">No se encontró la lección.</p>
          <button
            onClick={onClose}
            className="mt-4 text-blue-600 hover:underline"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <TheoryView
        lesson={lesson}
        onStartPractice={handleStartPractice}
        onReset={handleReset}
        practiceInProgress={lessonData.status == "IN_PROGRESS"}
        isInModal={true}
        isResetting={resetMutation.isPending}
      />
    </Modal>
  );
}
