import { useState, useCallback } from 'react';

export default function MatchPairsActivity({ items, answers, onAnswer }) {
  const answerMap = (answers || []).reduce((acc, a) => {
    acc[a.questionId] = a;
    return acc;
  }, {});

  const [selectedConceptId, setSelectedConceptId] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [feedback, setFeedback] = useState({});

  const allDefinitions = items.length > 0 ? items[0].options.definitions : [];

  const pairedDefinitionIds = new Set(
    Object.values(answerMap)
      .filter(a => a.correct)
      .map(a => a.userAnswer)
  );

  const availableDefinitions = allDefinitions.filter(d => !pairedDefinitionIds.has(d.id));

  const handleSelectConcept = (itemId) => {
    if (submittingId) return;
    const existing = answerMap[itemId];
    if (existing) return;
    setSelectedConceptId(prev => prev === itemId ? null : itemId);
  };

  const handleSelectDefinition = useCallback(
    async (definitionId) => {
      if (!selectedConceptId || submittingId) return;

      setSubmittingId(selectedConceptId);
      try {
        const result = await onAnswer(selectedConceptId, definitionId);
        setFeedback(prev => ({
          ...prev,
          [selectedConceptId]: {
            correct: result.correct,
            xpAwarded: result.xpAwarded,
          },
        }));
        setSelectedConceptId(null);
      } catch (err) {
        console.error('Error al enviar respuesta:', err);
      } finally {
        setSubmittingId(null);
      }
    },
    [selectedConceptId, submittingId, onAnswer]
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Emparejar conceptos</h3>
      <p className="text-sm text-gray-600 mb-6">
        Seleccioná un concepto de la izquierda y luego elegí la definición correcta de la derecha.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Columna izquierda: Conceptos */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Conceptos</h4>
          {items.map((item) => {
            const existing = answerMap[item.id];
            const fb = feedback[item.id];
            const isAnswered = !!existing;
            const isCorrect = existing?.correct ?? fb?.correct;
            const isSelected = selectedConceptId === item.id;
            const isSubmitting = submittingId === item.id;
            const isBlocked = isAnswered && !isCorrect;

            // 💡 XP: prioriza el feedback local, luego el backend, finalmente 0
            const xpAwarded = fb?.xpAwarded ?? existing?.xpAwarded ?? 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectConcept(item.id)}
                disabled={isBlocked || isAnswered || isSubmitting}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isBlocked
                    ? 'border-red-300 bg-red-50 opacity-70 cursor-not-allowed'
                    : isCorrect
                    ? 'border-green-400 bg-green-50 cursor-default'
                    : isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md'
                    : isSubmitting
                    ? 'border-yellow-300 bg-yellow-50 opacity-70'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium text-gray-800">{item.prompt}</span>
                  {isSubmitting && (
                    <svg className="animate-spin h-5 w-5 text-yellow-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {isCorrect && (
                    <span className="text-green-600 text-lg flex-shrink-0">✅</span>
                  )}
                  {isBlocked && (
                    <span className="text-red-500 text-lg flex-shrink-0">❌</span>
                  )}
                  {isSelected && !isAnswered && !isSubmitting && (
                    <span className="text-blue-500 text-sm font-medium flex-shrink-0">Seleccionado</span>
                  )}
                </div>
                {/* Mensaje de XP corregido */}
                {(isCorrect || isBlocked) && (
                  <p className={`text-xs mt-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? `+${xpAwarded} XP` : 'Sin puntos'}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Columna derecha: Definiciones (sin cambios) */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Definiciones</h4>
          {availableDefinitions.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              Todas las definiciones fueron emparejadas correctamente.
            </p>
          )}
          {availableDefinitions.map((def) => {
            const isClickable = !!selectedConceptId && !submittingId;
            return (
              <button
                key={def.id}
                type="button"
                onClick={() => isClickable && handleSelectDefinition(def.id)}
                disabled={!isClickable}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isClickable
                    ? 'border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 hover:shadow-md cursor-pointer'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className={isClickable ? 'text-gray-800' : 'text-gray-400'}>
                  {def.text}
                </span>
                {isClickable && (
                  <span className="block text-xs text-blue-500 mt-1">
                    Click para seleccionar esta definición
                  </span>
                )}
              </button>
            );
          })}
          {allDefinitions
            .filter(d => pairedDefinitionIds.has(d.id))
            .map(def => (
              <div
                key={def.id}
                className="w-full text-left p-4 rounded-xl border-2 border-green-300 bg-green-50 opacity-60"
              >
                <span className="text-gray-500 line-through">{def.text}</span>
                <span className="block text-xs text-green-600 mt-1">Ya emparejada</span>
              </div>
            ))}
        </div>
      </div>

      {!selectedConceptId && !submittingId && items.some(item => !answerMap[item.id]) && (
        <p className="text-sm text-gray-400 text-center mt-4">
          ↑ Seleccioná un concepto de la izquierda para comenzar
        </p>
      )}
    </div>
  );
}