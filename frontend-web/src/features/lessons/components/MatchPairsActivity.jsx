import { useState } from 'react';
import Button from '../../../shared/components/Button';

export default function MatchPairsActivity({ items, answers, onAnswer }) {
  const [selections, setSelections] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const answerMap = (answers || []).reduce((acc, a) => {
    acc[a.questionId] = a;
    return acc;
  }, {});

  const handleSelectionChange = (itemId, definitionId) => {
    setSelections(prev => ({ ...prev, [itemId]: definitionId }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    // Envía secuencialmente las respuestas aún no enviadas
    for (const item of items) {
      if (answerMap[item.id]) continue; // ya respondida
      const selectedDef = selections[item.id];
      if (selectedDef) {
        try {
          await onAnswer(item.id, selectedDef);
        } catch (err) {
          console.error(`Error al enviar respuesta para ${item.id}`, err);
          break;  // detenemos para no generar más errores
        }
      }
    }
    setSubmitting(false);
  };

  const allSelected = items.every(item => answerMap[item.id] || selections[item.id]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Emparejar conceptos</h3>
      {items.map(item => {
        const existing = answerMap[item.id];
        const isAnswered = !!existing;
        const selectedDefId = selections[item.id] || existing?.userAnswer;
        const isCorrect = existing?.correct;

        return (
          <div key={item.id} className="border rounded-lg p-4 bg-white">
            <label className="block font-medium mb-2">{item.prompt}</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              value={selectedDefId || ''}
              disabled={isAnswered || submitting}
              onChange={(e) => handleSelectionChange(item.id, e.target.value)}
              aria-label={`Selecciona la definición para ${item.prompt}`}
            >
              <option value="">-- Selecciona una definición --</option>
              {item.options.definitions.map(def => (
                <option key={def.id} value={def.id}>{def.text}</option>
              ))}
            </select>
            {isAnswered && (
              <p className={`mt-2 text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`} role="alert">
                {isCorrect ? '✅ Correcto' : '❌ Incorrecto'} – +{item.xpReward} XP
              </p>
            )}
          </div>
        );
      })}
      {items.some(item => !answerMap[item.id]) && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!allSelected || submitting}
            isLoading={submitting}
            className="w-full sm:w-auto"
          >
            Enviar respuestas
          </Button>
        </div>
      )}
    </div>
  );
};