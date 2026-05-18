import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";

export default function LessonResult({ result, onReset, onBackToRoadmap }) {
  const passed = result.status === "COMPLETED";
  const pointsObtained = result.totalScore ?? 0;
  const totalPoints = 100;
  const percentScore = pointsObtained;
  const xpEarned = result.totalXpEarned ?? 0;

  return (
    <section
      aria-labelledby="result-heading"
      className="bg-white rounded-lg p-8 shadow-sm text-center space-y-4"
    >
      <h2 id="result-heading" className="text-3xl font-bold">
        {passed ? "🎉 ¡Lección completada!" : "😞 No has aprobado"}
      </h2>
      <div className="text-lg">
        <p>
          Puntuación:{" "}
          <strong>
            {pointsObtained}/{totalPoints}
          </strong>{" "}
          ({percentScore}%)
        </p>
        <p>
          XP ganada: <strong>+{xpEarned} XP</strong>
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <Link to="/roadmap" onClick={onBackToRoadmap}>
          <Button className="cursor-pointer">Volver al Roadmap</Button>
        </Link>
        <Button
          onClick={onReset}
          className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 !text-black"
        >
          Reiniciar lección
        </Button>
      </div>
    </section>
  );
}
