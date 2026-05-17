import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Button from "../shared/components/Button";
import { LogoIcon } from "../shared/components/LogoIcon";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
        />
      </svg>
    ),
    title: "Aprendizaje interactivo",
    description:
      "Actividades dinámicas que te mantienen comprometido mientras aprendes conceptos clave de ingeniería de software.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Progreso guiado",
    description:
      "Un roadmap estructurado paso a paso que te lleva desde los fundamentos hasta la maestría en levantamiento de requerimientos.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Evaluaciones prácticas",
    description:
      "Pon a prueba tus conocimientos con ejercicios de verdadero/falso, matching, casos de estudio y más.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Enfoque realista en proyectos",
    description:
      "Trabaja con escenarios basados en proyectos reales para desarrollar habilidades aplicables en el mundo laboral.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);

  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      navigate("/roadmap");
    } else {
      navigate("/login");
    }
  };

  const handleLearnMore = () => {
    document
      .getElementById("benefits-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Background Effects - Enhanced */}
        <div className="absolute inset-0 -z-10">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />

          {/* Animated blobs */}
          <div className="absolute top-0 left-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[250px] sm:w-[350px] md:w-[450px] h-[250px] sm:h-[350px] md:h-[450px] bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-1000" />

          {/* New: Floating dots pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-300" />
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-500 rounded-full animate-ping delay-700" />
            <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-500" />
          </div>

          {/* New: Grid con gradiente */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* New: Círculos decorativos estáticos */}
          <div className="absolute top-20 left-10 w-64 h-64 border border-blue-200/30 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-cyan-200/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-100/20 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center w-full relative z-10">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            {/* Title */}
            <div className="space-y-3 sm:space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-gray-900"
              >
                Domina el{" "}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
                    levantamiento
                  </span>
                  <span className="absolute inset-0 blur-2xl opacity-30 bg-blue-400 -z-10" />
                </span>{" "}
                de requerimientos como un experto
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                Aprende Ingeniería de Software de forma{" "}
                <span className="font-semibold text-blue-600">
                  interactiva, práctica y estructurada
                </span>
                .
                <br className="hidden sm:block" />
                Avanza a tu ritmo con un camino guiado que te prepara para el
                mundo real.
              </motion.p>
            </div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={handlePrimaryAction}
                className="group relative overflow-hidden px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-300/40 transition-all duration-300 hover:scale-[1.02] sm:hover:scale-[1.03] w-full sm:w-auto"
              >
                <span className="relative z-10">
                  {isAuthenticated ? "Sigue aprendiendo" : "Comienza ahora"}
                </span>
                <span className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>

              <button
                onClick={handleLearnMore}
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 w-full sm:w-auto cursor-pointer"
              >
                Conoce más
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 pt-2 sm:pt-4"
            >
              <div className="text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                  +5
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Actividades
                </p>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                  100%
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Interactivo
                </p>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                  XP
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Gamificación
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Hidden on mobile, visible on lg screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:flex justify-center relative"
          >
            <div className="relative z-10">
              {/* Glow background */}
              <div className="absolute inset-0 bg-blue-400/20 blur-3xl scale-125 rounded-full" />

              {/* FLOATING CARD - PROGRESS */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -left-14 z-30 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-5 border border-white/50 w-56"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    Progreso
                  </span>
                  <span className="text-xs font-bold text-blue-600">75%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Roadmap de requerimientos
                </p>
              </motion.div>

              {/* FLOATING CARD - XP */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-8 -right-10 z-30 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-5 border border-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-2xl shadow-lg">
                    🏆
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">+250 XP</p>
                    <p className="text-sm text-gray-500">Ganados hoy</p>
                  </div>
                </div>
              </motion.div>

              {/* MAIN WINDOW */}
              <div className="relative z-20 w-[480px] xl:w-[500px] h-[540px] xl:h-[560px] rounded-[32px] xl:rounded-[36px] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-[1px] shadow-[0_25px_90px_rgba(59,130,246,0.35)]">
                <div className="w-full h-full bg-white/95 backdrop-blur-xl rounded-[32px] xl:rounded-[36px] p-6 xl:p-8 overflow-hidden">
                  {/* Top window controls */}
                  <div className="flex gap-2 mb-6 xl:mb-8">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>

                  {/* LOGO + TITLE */}
                  <div className="flex flex-col items-center text-center mb-8 xl:mb-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 scale-125 rounded-3xl" />
                      <div className="relative w-24 h-24 xl:w-28 xl:h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-2xl">
                        <LogoIcon className="text-white w-14 h-14 xl:w-16 xl:h-16" />
                      </div>
                    </div>
                    <h3 className="mt-5 xl:mt-6 text-2xl xl:text-3xl font-black text-gray-900">
                      Requirement Master
                    </h3>
                    <p className="mt-2 xl:mt-3 text-sm xl:text-base text-gray-500 max-w-xs leading-relaxed">
                      Aprende levantamiento de requerimientos de forma
                      interactiva y moderna.
                    </p>
                  </div>

                  {/* Mock Content */}
                  <div className="space-y-5 xl:space-y-6">
                    <div className="grid grid-cols-2 gap-3 xl:gap-4">
                      <div className="rounded-xl xl:rounded-2xl border border-blue-100 bg-blue-50 p-4 xl:p-5">
                        <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-lg xl:rounded-xl bg-blue-500 mb-3 xl:mb-4" />
                        <div className="h-2.5 xl:h-3 bg-blue-200 rounded-full w-16 xl:w-20 mb-1.5 xl:mb-2" />
                        <div className="h-2.5 xl:h-3 bg-blue-100 rounded-full w-full" />
                      </div>
                      <div className="rounded-xl xl:rounded-2xl border border-cyan-100 bg-cyan-50 p-4 xl:p-5">
                        <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-lg xl:rounded-xl bg-cyan-500 mb-3 xl:mb-4" />
                        <div className="h-2.5 xl:h-3 bg-cyan-200 rounded-full w-16 xl:w-20 mb-1.5 xl:mb-2" />
                        <div className="h-2.5 xl:h-3 bg-cyan-100 rounded-full w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== BENEFITS SECTION ========== */}
      <section
        id="benefits-section"
        className="py-16 sm:py-20 bg-gray-50 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              ¿Por qué elegir Requirement Master?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Una experiencia de aprendizaje diseñada para que realmente domines
              los conceptos.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  {benefit.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
          {/* Texto */}
          <div className="space-y-5 sm:space-y-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Aprende de forma estructurada y efectiva
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Nuestro método combina teoría clara con práctica intensiva. Cada
              lección incluye contenido explicativo y múltiples actividades
              interactivas con feedback inmediato para que sepas exactamente
              cómo vas.
            </p>
            <ul className="space-y-2.5 sm:space-y-3 max-w-md mx-auto lg:mx-0">
              {[
                "Lecciones con teoría y práctica integrada",
                "Actividades variadas: matching, V/F, casos de estudio",
                "Sistema de puntuación y XP para mantenerte motivado",
                "Examen final que certifica tu aprendizaje",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 justify-center lg:justify-start"
                >
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm sm:text-base text-gray-700 text-left">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual decorativo - Hidden on mobile, visible on lg */}
          <div className="hidden lg:flex justify-center relative">
            <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full absolute -z-10 blur-2xl opacity-60" />
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 w-full max-w-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                <div className="h-3 bg-gray-200 rounded-full w-full" />
                <div className="h-3 bg-gray-200 rounded-full w-5/6" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-24 bg-blue-50 rounded-xl" />
                <div className="flex-1 h-24 bg-green-50 rounded-xl" />
              </div>
              <div className="h-10 bg-blue-600 rounded-xl w-1/2" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Empieza tu camino para convertirte en un experto
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto px-4">
            Únete a cientos de estudiantes que ya están mejorando sus
            habilidades en ingeniería de software con Requirement Master.
          </p>
          <Button
            onClick={handlePrimaryAction}
            className="px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl  transition-all duration-300 rounded-xl cursor-pointer w-full sm:w-auto"
          >
            {isAuthenticated ? "Ir al Roadmap" : "Comenzar ahora"}
          </Button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 text-center text-xs sm:text-sm text-gray-500 border-t border-gray-100">
        <p>
          &copy; {new Date().getFullYear()} Requirement Master. Todos los
          derechos reservados.
        </p>
      </footer>
    </div>
  );
}
