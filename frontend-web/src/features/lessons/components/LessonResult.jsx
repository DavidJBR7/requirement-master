import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  XCircle,
  Trophy,
  Lightning,
  ArrowCounterClockwise,
  House,
} from "@phosphor-icons/react";

import { playSound } from "../../../utils/soundManager";

export default function LessonResult({ result, onReset, onBackToRoadmap }) {
  const passed = result.status === "COMPLETED";

  const pointsObtained = result.totalScore ?? 0;
  const totalPoints = 100;
  const percentScore = Math.min(100, Math.max(0, pointsObtained));

  const xpEarned = result.totalXpEarned ?? 0;

  useEffect(() => {
    if (passed) {
      playSound("completed_correct");

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.65 },
      });
    } else {
      playSound("completed_wrong");
    }
  }, [passed]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <motion.section
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        aria-labelledby="result-heading"
        className="
          relative overflow-hidden
          w-full max-w-2xl
          rounded-[2rem]
          border border-blue-100
          bg-white
          shadow-[0_20px_60px_rgba(59,130,246,0.10)]
        "
      >
        {/* Fondo decorativo */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="
              absolute -top-24 -right-24
              w-72 h-72
              rounded-full
              bg-blue-200/40
              blur-3xl
            "
          />

          <div
            className="
              absolute -bottom-28 -left-20
              w-72 h-72
              rounded-full
              bg-cyan-100
              blur-3xl
            "
          />
        </div>

        <div className="relative z-10 p-8 md:p-10">
          {/* Icono */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 12,
              delay: 0.15,
            }}
            className="flex justify-center"
          >
            <div
              className={`
                w-28 h-28 rounded-full
                flex items-center justify-center
                border shadow-lg
                ${
                  passed
                    ? "bg-blue-50 border-blue-200"
                    : "bg-red-50 border-red-200"
                }
              `}
            >
              {passed ? (
                <CheckCircle
                  size={62}
                  weight="fill"
                  className="text-blue-500"
                />
              ) : (
                <XCircle size={62} weight="fill" className="text-red-400" />
              )}
            </div>
          </motion.div>

          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-center mt-6"
          >
            <h2
              id="result-heading"
              className="
                text-3xl md:text-4xl
                font-black
                tracking-tight
                text-slate-800
              "
            >
              {passed ? "¡Lección completada!" : "Lección no aprobada"}
            </h2>

            <p className="mt-3 text-slate-500 max-w-lg mx-auto">
              {passed
                ? "Excelente trabajo. Continúa avanzando en tu ruta de aprendizaje."
                : "Todavía puedes mejorar tus resultados. Reinicia la lección e inténtalo nuevamente."}
            </p>
          </motion.div>

          {/* Tarjeta score */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="
              mt-8
              rounded-3xl
              border border-blue-100
              bg-gradient-to-br
              from-blue-50
              to-cyan-50
              p-6
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-11 h-11 rounded-2xl
                    bg-white
                    border border-blue-100
                    flex items-center justify-center
                    shadow-sm
                  "
                >
                  <Trophy size={22} weight="fill" className="text-yellow-500" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Puntuación obtenida</p>

                  <p className="text-2xl font-black text-slate-800">
                    {pointsObtained}/{totalPoints}
                  </p>
                </div>
              </div>

              <div
                className={`
                  px-4 py-2 rounded-2xl
                  bg-white border border-blue-100
                  ${passed ? "text-green-600" : "text-red-500"}
                  font-bold text-lg
                `}
              >
                {percentScore}%
              </div>
            </div>

            {/* Barra */}
            <div className="mt-6">
              <div className="w-full h-4 rounded-full bg-white overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${percentScore}%`,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.45,
                    ease: "easeOut",
                  }}
                  className={`
                    h-full rounded-full
                    bg-gradient-to-r
                    ${
                      passed
                        ? "from-green-500 to-emerald-300"
                        : "from-red-600 to-rose-300"
                    }
                  `}
                />
              </div>
            </div>

            {/* XP */}
            <div
              className="
                mt-6
                rounded-2xl
                bg-white/90
                border border-blue-100
                px-5 py-4
                flex items-center justify-center gap-4
              "
            >
              <div
                className="
                  w-12 h-12 rounded-2xl
                  bg-blue-100
                  flex items-center justify-center
                "
              >
                <Lightning size={24} weight="fill" className="text-blue-500" />
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500">XP ganada</p>

                <p className="text-3xl font-black text-slate-800">
                  +{xpEarned}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Botones */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="
              mt-8
              flex flex-col sm:flex-row
              gap-4
            "
          >
            <Link to="/roadmap" onClick={onBackToRoadmap} className="flex-1">
              <button
                className="
                  w-full h-14
                  rounded-2xl
                  border border-blue-200
                  bg-white
                  hover:bg-blue-50
                  text-slate-700
                  font-semibold
                  transition-all duration-200
                  cursor-pointer
                  flex items-center justify-center gap-2
                  shadow-sm hover:shadow-md
                "
              >
                <House size={20} weight="fill" />
                Volver al roadmap
              </button>
            </Link>

            <button
              onClick={onReset}
              className="
                w-full sm:flex-1 h-14
                rounded-2xl
                border border-blue-500
                bg-blue-500
                hover:bg-blue-600
                text-white
                font-bold
                transition-all duration-200
                cursor-pointer
                flex items-center justify-center gap-2
                shadow-lg shadow-blue-500/20
              "
            >
              <ArrowCounterClockwise size={20} weight="bold" />
              Reiniciar lección
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
