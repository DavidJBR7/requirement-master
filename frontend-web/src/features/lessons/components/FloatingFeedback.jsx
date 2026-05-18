import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Lightning } from "@phosphor-icons/react";

export default function FloatingFeedback({ show, correct, xp = 0 }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -12,
            scale: 0.9,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="
            absolute inset-0
            flex items-center justify-center
            pointer-events-none
            z-20
          "
        >
          <div
            className={`
              flex items-center gap-3
              px-5 py-4 rounded-3xl
              shadow-2xl border backdrop-blur-xl
              ${
                correct
                  ? "bg-emerald-500/95 border-emerald-400 text-white"
                  : "bg-rose-500/95 border-rose-400 text-white"
              }
            `}
          >
            <div
              className={`
                w-11 h-11 rounded-2xl
                flex items-center justify-center
                ${correct ? "bg-white/20" : "bg-black/10"}
              `}
            >
              {correct ? (
                <CheckCircle size={24} weight="fill" />
              ) : (
                <XCircle size={24} weight="fill" />
              )}
            </div>

            <div>
              <p className="font-bold text-base leading-none">
                {correct ? "Correcto" : "Incorrecto"}
              </p>

              <div className="flex items-center gap-1 mt-1">
                <Lightning size={14} weight="fill" />

                <span className="text-sm font-semibold">+{xp} XP</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
