import { useNavigate } from "react-router-dom";
import Modal from "../../../shared/components/Modal";
import TheoryView from "./TheoryView";

export default function TheoryModal({ lessonId, isOpen, onClose, lessonData }) {
  const navigate = useNavigate();

  const lesson = lessonData
    ? {
        id: lessonData.id,
        title: lessonData.title,
        status: lessonData.status,
      }
    : null;

  const handleStartPractice = () => {
    onClose();
    navigate(`/lessons/${lessonId}?start=practice`);
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
        isInModal={true}
      />
    </Modal>
  );
}
