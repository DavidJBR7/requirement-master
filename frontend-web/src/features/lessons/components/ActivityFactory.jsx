import TrueFalseActivity from "./TrueFalseActivity";
import MatchPairsActivity from "./MatchPairsActivity";

export default function ActivityFactory({
  activity,
  onSubmitAnswer,
  onActivityComplete,
}) {
  if (!activity) return null;

  const items = activity.configuration?.items || [];
  const answers = activity.currentProgress?.answers || [];

  switch (activity.type) {
    case "TRUE_FALSE":
      return (
        <TrueFalseActivity
          items={items}
          initialAnswers={answers}
          onSubmitAnswer={onSubmitAnswer}
          onActivityComplete={onActivityComplete}
          activityId={activity.id}
          maxScore={activity.maxScore}
          maxXp={activity.maxXp}
        />
      );
    case "MATCH_PAIRS":
      return (
        <MatchPairsActivity
          items={items}
          initialAnswers={answers}
          onSubmitAnswer={onSubmitAnswer}
          onActivityComplete={onActivityComplete}
          activityId={activity.id}
          maxScore={activity.maxScore}
          maxXp={activity.maxXp}
        />
      );
    default:
      return (
        <p className="text-gray-500">Tipo de actividad no soportada aún.</p>
      );
  }
}
