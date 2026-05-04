import { useState } from 'react';
import Button from '../../../shared/components/Button';

export default function TrueFalseActivity({ items, answers, onAnswer }) {
  const [submittingId, setSubmittingId] = useState(null);

  const answerMap = (answers || []).reduce((acc, a) => {
    acc[a.questionId] = a;
    return acc;
  }, {});

  const handleAnswer = async (itemId, value) => {
    if (submittingId) return;
    setSubmittingId(itemId);
    try {
      await onAnswer(itemId, value);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Verdadero o Falso</h3>
      {items.map((item) => {
        const existing = answerMap[item.id];
        const isAnswered = !!existing;
        const isCorrect = existing?.correct;

        return (
          <fieldset key={item.id} className="border rounded-lg p-4 bg-white">
            <legend className="text-base font-medium mb-3">{item.prompt}</legend>
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => handleAnswer(item.id, true)}
                disabled={isAnswered || !!submittingId}
                isLoading={submittingId === item.id}
              >
                Verdadero
              </Button>
              <Button
                type="button"
                onClick={() => handleAnswer(item.id, false)}
                disabled={isAnswered || !!submittingId}
                isLoading={submittingId === item.id}
              >
                Falso
              </Button>
            </div>
            {isAnswered && (
              <p className={`mt-2 text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`} role="alert">
                {isCorrect ? '✅ Correcto' : '❌ Incorrecto'} – +{item.xpReward} XP
              </p>
            )}
          </fieldset>
        );
      })}
    </div>
  );
};