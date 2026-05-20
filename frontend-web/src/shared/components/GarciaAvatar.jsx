import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function GarciaAvatar({ mood = "neutral", talking = false }) {
  // Paleta de colores extraída y mejorada de la imagen original
  const colors = {
    skin: "#f1cec2",
    nose: "#e9c2b4",
    hair: "#383838",
    shirt: "#a1bdff",
    white: "#FFFFFF",
  };

  // Configuración de las expresiones según el 'mood'
  const getFaceConfig = () => {
    const base = {
      eyeRy: 14,
      leftLidY: 102, // Controla qué tan cerrado está el párpado izquierdo
      rightLidY: 102, // Controla qué tan cerrado está el párpado derecho
      leftPupilX: 73,
      rightPupilX: 127,
      leftBrowY: 80,
      rightBrowY: 80,
      leftBrowRot: 0,
      rightBrowRot: 0,
    };

    switch (mood) {
      case "approved": // 😃 Feliz / Aprobado
        return {
          ...base,
          leftLidY: 92,
          rightLidY: 90,
          leftBrowY: 70,
          rightBrowY: 75,
          leftBrowRot: 0,
          rightBrowRot: 0,
        };
      case "maybe": // 😑 Pensativo / Entrecerrado
        return {
          ...base,
          leftLidY: 92,
          rightLidY: 90,
          leftBrowY: 70,
          rightBrowY: 80,
          leftBrowRot: 10,
          rightBrowRot: -10,
        };

      case "confused": // 🤨 Confundido / Ceja levantada
        return {
          ...base,
          eyeRy: 6, // Ojos muy estrechos
          leftLidY: 105,
          rightLidY: 105,
          leftBrowY: 85,
          rightBrowY: 85, // Cejas bajas
        };

      case "incorrect": // 😒 Incorrecto / Molesto mirando a un lado
        return {
          ...base,
          leftLidY: 105,
          rightLidY: 105, // Mirada pesada
          leftPupilX: 66,
          rightPupilX: 120, // Pupilas hacia la izquierda
          leftBrowY: 83,
          rightBrowY: 83, // Cejas planas y ligeramente bajas
          leftBrowRot: 3,
          rightBrowRot: -3,
        };
      case "neutral": // 😐
      default:
        return {
          ...base,
          leftLidY: 98,
          rightLidY: 98,
          leftBrowY: 75,
          rightBrowY: 75,
          leftBrowRot: -5,
          rightBrowRot: 5,
        };
    }
  };

  const config = getFaceConfig();

  // Animación natural de parpadeo
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Si parpadea, los ojos se aplanan temporalmente
  const currentEyeRy = blink ? 2 : config.eyeRy;

  // Animación de físicas suaves para las transiciones
  const springTransition = { type: "spring", stiffness: 300, damping: 25 };

  return (
    <motion.div
      animate={talking ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 0.3, repeat: Infinity }}
    >
      {/* ViewBox ajustado para acomodar el volumen del cabello */}
      <svg viewBox="0 0 200 240" className="w-full h-full">
        {/* SHIRT (Camisa) */}
        <rect
          x="30"
          y="150"
          width="140"
          height="90"
          rx="20"
          fill={colors.shirt}
        />

        {/* V-NECK (Cuello en V de piel) */}
        <polygon points="70,150 130,150 100,200" fill={colors.skin} />

        {/* HEAD (Cabeza base) */}
        <rect
          x="35"
          y="50"
          width="130"
          height="130"
          rx="35"
          fill={colors.skin}
        />

        {/* EARS (Orejas) */}
        <circle cx="32" cy="130" r="16" fill={colors.skin} />
        <circle cx="168" cy="130" r="16" fill={colors.skin} />

        {/* HAIR (Cabello voluptuoso usando un path curvo elegante) */}
        <path
          d="
            M 35 115 
            C 10 80, 20 40, 60 30 
            C 70 -10, 130 -10, 140 30 
            C 180 40, 190 80, 165 115 
            Q 145 60, 100 60 
            Q 55 60, 35 115 Z
          "
          fill={colors.hair}
        />

        {/* EYES WHITES (Fondo de los ojos) */}
        <motion.ellipse
          cx="73"
          cy="105"
          rx="14"
          animate={{ ry: currentEyeRy }}
          transition={springTransition}
          fill={colors.white}
        />
        <motion.ellipse
          cx="127"
          cy="105"
          rx="14"
          animate={{ ry: currentEyeRy }}
          transition={springTransition}
          fill={colors.white}
        />

        {/* PUPILS (Pupilas dinámicas) */}
        <motion.circle
          cy="105"
          r="5"
          fill={colors.hair}
          animate={{ cx: config.leftPupilX, scaleY: blink ? 0.3 : 1 }}
          transition={springTransition}
        />
        <motion.circle
          cy="105"
          r="5"
          fill={colors.hair}
          animate={{ cx: config.rightPupilX, scaleY: blink ? 0.3 : 1 }}
          transition={springTransition}
        />

        {/* EYELIDS (Párpados) - Máscaras del color de la piel que bajan para dar el look "Neutral" de la foto */}
        <motion.rect
          x="50"
          width="46"
          height="30"
          fill={colors.skin}
          animate={{ y: config.leftLidY - 30 }}
          transition={springTransition}
        />
        <motion.rect
          x="104"
          width="46"
          height="30"
          fill={colors.skin}
          animate={{ y: config.rightLidY - 30 }}
          transition={springTransition}
        />

        {/* EYEBROWS (Cejas gruesas) */}
        <motion.rect
          x="57"
          width="32"
          height="12"
          rx="6"
          fill={colors.hair}
          style={{ transformOrigin: "73px 80px" }}
          animate={{ y: config.leftBrowY, rotate: config.leftBrowRot }}
          transition={springTransition}
        />
        <motion.rect
          x="111"
          width="32"
          height="12"
          rx="6"
          fill={colors.hair}
          style={{ transformOrigin: "127px 80px" }}
          animate={{ y: config.rightBrowY, rotate: config.rightBrowRot }}
          transition={springTransition}
        />

        {/* MUSTACHE (Bigote espeso de la imagen) */}
        <motion.path
          d="
            M 100 125 
            C 40 115, 30 185, 85 185 
            C 95 185, 100 175, 100 175 
            C 100 175, 105 185, 115 185 
            C 170 185, 160 115, 100 125 Z
          "
          fill={colors.hair}
          style={{ transformOrigin: "100px 130px" }}
          animate={
            talking
              ? { scaleY: [1, 1.15, 1], y: [0, 3, 0] } // Al hablar el bigote rebota, ¡no necesitamos dibujar la boca!
              : { scaleY: 1, y: 0 }
          }
          transition={{ duration: 0.25, repeat: talking ? Infinity : 0 }}
        />

        {/* NOSE (Nariz redondeada por encima del bigote) */}
        <circle cx="100" cy="132" r="12" fill={colors.nose} />
      </svg>
    </motion.div>
  );
}
