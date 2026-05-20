import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TypingMessage({
  text,
  active,
  onFinished,
  speed = 25,
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) return;

    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);

        onFinished?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [active, text, speed, onFinished]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="max-w-[80%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm whitespace-pre-wrap"
    >
      {displayed}

      {active && (
        <motion.span
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="ml-1 inline-block"
        >
          |
        </motion.span>
      )}
    </motion.div>
  );
}
