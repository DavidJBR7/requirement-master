import TrueFalseActivity from './TrueFalseActivity';
import MatchPairsActivity from './MatchPairsActivity';

export default function ActivityFactory({ activity, onAnswer }) {
  if (!activity) return null;

  const items = activity.configuration?.items || [];
  const answers = activity.currentProgress?.answers || [];

  switch (activity.type) {
    case 'TRUE_FALSE':
      return <TrueFalseActivity items={items} answers={answers} onAnswer={onAnswer} />;
    case 'MATCH_PAIRS':
      return <MatchPairsActivity items={items} answers={answers} onAnswer={onAnswer} />;
    default:
      return <p className="text-gray-500">Tipo de actividad no soportada aún.</p>;
  }
}