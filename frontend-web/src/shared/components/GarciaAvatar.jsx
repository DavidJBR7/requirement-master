import { motion } from "framer-motion";

export default function GarciaAvatar({ mood = "neutral", talking = false }) {
  const mouth =
    mood === "happy"
      ? "M 85 140 Q 100 155 115 140"
      : mood === "confused"
        ? "M 85 145 Q 100 135 115 145"
        : "M 85 145 Q 100 148 115 145";

  return (
    <motion.div
      animate={
        talking
          ? {
              y: [0, -2, 0],
            }
          : {}
      }
      transition={{
        duration: 0.25,
        repeat: Infinity,
      }}
      className="w-56"
    >
      <svg viewBox="0 0 220 280" className="w-full h-full">
        {/* BODY */}

        <rect x="55" y="170" width="110" height="80" rx="20" fill="#F9A8D4" />

        {/* HEAD */}

        <rect x="45" y="40" width="130" height="160" rx="55" fill="#D48B6F" />

        {/* HAIR */}

        <path
          d="
            M50 70
            Q50 10 110 10
            Q170 10 170 70
            Q150 40 110 40
            Q70 40 50 70
          "
          fill="#2F2F35"
        />

        {/* MUSTACHE */}

        <path
          d="
            M70 120
            Q110 90 150 120
            Q150 155 110 150
            Q70 155 70 120
          "
          fill="#2F2F35"
        />

        {/* EYES */}

        <ellipse cx="90" cy="95" rx="10" ry="12" fill="#FFF" />

        <ellipse cx="130" cy="95" rx="10" ry="12" fill="#FFF" />

        <circle cx="90" cy="100" r="5" fill="#2F2F35" />

        <circle cx="130" cy="100" r="5" fill="#2F2F35" />

        {/* EYEBROWS */}

        <rect x="72" y="74" width="32" height="8" rx="4" fill="#2F2F35" />

        <rect x="116" y="74" width="32" height="8" rx="4" fill="#2F2F35" />

        {/* MOUTH */}

        <motion.path
          d={mouth}
          stroke="#5B2C1B"
          strokeWidth="5"
          fill="transparent"
          strokeLinecap="round"
          animate={
            talking
              ? {
                  d: [mouth, "M 82 145 Q 100 165 118 145", mouth],
                }
              : {
                  d: mouth,
                }
          }
          transition={{
            duration: 0.2,
            repeat: Infinity,
          }}
        />
      </svg>
    </motion.div>
  );
}
