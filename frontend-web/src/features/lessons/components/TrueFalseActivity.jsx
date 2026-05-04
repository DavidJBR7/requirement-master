import { useState } from 'react';
import Button from '../../../shared/components/Button';

export default function TrueFalseActivity({ items, answers, onAnswer }) {
  // Prop answers: array de { questionId, userAnswer, correct, ... } (del progreso ya cargado)

  const handleAnswer = (itemId, value) => {
    onAnswer(itemId, value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Verdadero o Falso</h3>
      {items.map((item) => {
        const existingAnswer = answers?.find(a => a.questionId === item.id);
        const isAnswered = !!existingAnswer;
        const isCorrect = existingAnswer?.isCorrect; // supondremos que el backend devuelve isCorrect

        return (
          <fieldset key={item.id} className="border rounded-lg p-4 bg-white">
            <legend className="text-base font-medium mb-3">{item.prompt}</legend>
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => handleAnswer(item.id, true)}
                disabled={isAnswered}
                className={`
                  ${isAnswered && existingAnswer.userAnswer === true
                    ? (isCorrect ? 'bg-green-600 hover:bg-green-600' : 'bg-red-600 hover:bg-red-600')
                    : ''}
                `}
              >
                Verdadero
              </Button>
              <Button
                type="button"
                onClick={() => handleAnswer(item.id, false)}
                disabled={isAnswered}
                className={`
                  ${isAnswered && existingAnswer.userAnswer === false
                    ? (isCorrect ? 'bg-green-600 hover:bg-green-600' : 'bg-red-600 hover:bg-red-600')
                    : ''}
                `}
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
}