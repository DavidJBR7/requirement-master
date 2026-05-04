import { useState } from 'react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

export default function MatchPairsActivity({ items, answers, onAnswer }) {
  // Para cada ítem mostramos el concepto y un select con definiciones
  const [selections, setSelections] = useState({});

  const handleSelectionChange = (itemId, definitionId) => {
    setSelections(prev => ({ ...prev, [itemId]: definitionId }));
  };

  const handleSubmit = () => {
    // Envía todas las respuestas no enviadas aún
    Object.entries(selections).forEach(([itemId, defId]) => {
      if (defId && !answers?.some(a => a.questionId === itemId)) {
        onAnswer(itemId, defId);
      }
    });
  };

  const allAnswered = items.every(item =>
    answers?.some(a => a.questionId === item.id) || selections[item.id]
  );

  const getDefinitionText = (defId) => {
    for (const item of items) {
      const def = item.options.definitions.find(d => d.id === defId);
      if (def) return def.text;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Emparejar conceptos</h3>
      {items.map(item => {
        const existingAnswer = answers?.find(a => a.questionId === item.id);
        const isAnswered = !!existingAnswer;
        const selectedDefId = selections[item.id] || existingAnswer?.userAnswer;
        const isCorrect = existingAnswer?.isCorrect;

        return (
          <div key={item.id} className="border rounded-lg p-4 bg-white">
            <label className="block font-medium mb-2">{item.prompt}</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedDefId || ''}
              disabled={isAnswered}
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
      {!items.every(item => answers?.some(a => a.questionId === item.id)) && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full sm:w-auto"
          >
            Enviar respuestas
          </Button>
        </div>
      )}
    </div>
  );
}