import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "@phosphor-icons/react";
import FloatingFeedback from "./FloatingFeedback";

export default function TrueFalseActivity({ items, answers, onAnswer }) {
  const [submittingId, setSubmittingId] = useState(null);

  const [feedback, setFeedback] = useState(null);

  const answerMap = (answers || []).reduce((acc, a) => {
    acc[a.questionId] = a;
    return acc;
  }, {});

  const handleAnswer = async (itemId, value) => {
    if (submittingId) return;

    setSubmittingId(itemId);

    try {
      const result = await onAnswer(itemId, value);

      setFeedback({
        itemId,
        correct: result.correct,
        xp: result.xpEarned || 0,
      });
    } finally {
      setSubmittingId(null);
    }
  };

  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => {
      setFeedback(null);
    }, 1800);

    return () => clearTimeout(timer);
  }, [feedback]);

  return (
    <div className="space-y-6 p-4 md:py-8 md:px-60">
      {items.map((item, index) => {
        const existing = answerMap[item.id];

        const isAnswered = !!existing;

        const isCorrect = existing?.correct;

        return (
          <motion.fieldset
            key={item.id}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.05,
            }}
            className={`
              relative overflow-hidden
              rounded-2xl
              border-2
              transition-all duration-300
              ${
                isAnswered
                  ? isCorrect
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-red-400 bg-rose-50"
                  : "border-blue-400 bg-blue-50"
              }
            `}
          >
            {/* feedback flotante */}
            <FloatingFeedback
              show={feedback?.itemId === item.id}
              correct={feedback?.correct}
              xp={feedback?.xp}
            />

            <legend
              className={`text-base font-bold ml-6 px-10 py-1 border-2 rounded-2xl 
                ${
                  isAnswered
                    ? isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : "border-red-400 bg-rose-50 text-rose-800"
                    : "border-blue-400 bg-blue-50"
                }`}
            >
              Pregunta {index + 1}
            </legend>

            <div className="p-4 md:p-6 md:pt-4">
              {/* pregunta */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 leading-relaxed">
                    {item.prompt}
                  </h3>
                </div>
              </div>

              {/* botones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => handleAnswer(item.id, true)}
                  disabled={isAnswered || !!submittingId}
                  className={`
                    py-2
                    rounded-2xl 
                    border
                    flex items-center justify-center 
                    gap-2
                    font-semibold
                    transition-all duration-200
                    ${
                      isAnswered && existing.userAnswer === true
                        ? isCorrect
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-rose-500 border-rose-500 text-white"
                        : `
                          border-slate-200
                          bg-white
                          hover:bg-blue-50
                          hover:border-blue-300
                          text-slate-700
                        `
                    }
                  `}
                >
                  <Check size={18} weight="bold" />
                  Verdadero
                </button>

                <button
                  type="button"
                  onClick={() => handleAnswer(item.id, false)}
                  disabled={isAnswered || !!submittingId}
                  className={`
                    py-2
                    rounded-2xl 
                    border
                    flex items-center justify-center 
                    gap-2
                    font-semibold
                    transition-all duration-200
                    ${
                      isAnswered && existing.userAnswer === false
                        ? isCorrect
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-rose-500 border-rose-500 text-white"
                        : `
                          border-slate-200
                          bg-white
                          hover:bg-blue-50
                          hover:border-blue-300
                          text-slate-700
                        `
                    }
                  `}
                >
                  <X size={18} weight="bold" />
                  Falso
                </button>
              </div>
            </div>
          </motion.fieldset>
        );
      })}
    </div>
  );
}
