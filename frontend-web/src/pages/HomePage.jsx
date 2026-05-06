import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../shared/components/Button';
import { LogoIcon } from '../shared/components/LogoIcon';

const benefits = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    title: 'Aprendizaje interactivo',
    description: 'Actividades dinamicas que te mantienen comprometido mientras aprendes conceptos clave de ingenieria de software.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Progreso guiado',
    description: 'Un roadmap estructurado paso a paso que te lleva desde los fundamentos hasta la maestria en levantamiento de requerimientos.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Evaluaciones practicas',
    description: 'Pon a prueba tus conocimientos con ejercicios de verdadero/falso, matching, casos de estudio y mas.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Enfoque realista en proyectos',
    description: 'Trabaja con escenarios basados en proyectos reales para desarrollar habilidades aplicables en el mundo laboral.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);

  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      navigate('/roadmap');
    } else {
      navigate('/login');
    }
  };

  const handleLearnMore = () => {
    document.getElementById('benefits-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen !bg-red overflow-hidden">
      {/* ========== HERO SECTION ========== */}
      <section className="relative px-6 pt-20 pb-16 lg:pt-32 lg:pb-24 max-w-7xl mx-auto">
        {/* Decoracion de fondo */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50 rounded-full opacity-50 blur-3xl" />
          <svg
            className="absolute top-20 right-10 w-72 h-72 text-blue-100 opacity-30"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            <circle cx="40" cy="40" r="20" />
            <circle cx="100" cy="30" r="15" />
            <circle cx="160" cy="50" r="25" />
            <circle cx="70" cy="120" r="18" />
            <circle cx="140" cy="130" r="22" />
          </svg>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Domina el{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                levantamiento de requerimientos
              </span>{' '}
              como un experto
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
              Aprende Ingeniería de Software de forma interactiva, práctica y estructurada. 
              Avanza a tu ritmo con un camino guiado que te prepara para el mundo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handlePrimaryAction}
                className="px-8 py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 rounded-xl cursor-pointer"
              >
                {isAuthenticated ? 'Comenzar a aprender' : 'Comienza ahora'}
              </Button>
              <button
                onClick={handleLearnMore}
                className="px-8 py-3 text-base font-semibold text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 cursor-pointer"
              >
                Conoce más
              </button>
            </div>
          </div>

          {/* Imagen / Ilustracion */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-blue-50 to-blue-300 rounded-3xl shadow-2xl shadow-blue-100 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-50 h-50 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <LogoIcon className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Requirement Master</h3>
                <p className="text-gray-600 text-sm">Tu plataforma interactiva para dominar el arte de los requerimientos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== BENEFITS SECTION ========== */}
      <section id="benefits-section" className="py-20 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Requirement Master?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una experiencia de aprendizaje diseñada para que realmente domines los conceptos.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Aprende de forma estructurada y efectiva
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nuestro metodo combina teoria clara con practica intensiva. Cada leccion incluye 
              contenido explicativo y multiples actividades interactivas con feedback inmediato 
              para que sepas exactamente como vas.
            </p>
            <ul className="space-y-3">
              {['Lecciones con teoria y practica integrada', 'Actividades variadas: matching, V/F, casos de estudio', 'Sistema de puntuacion y XP para mantenerte motivado', 'Examen final que certifica tu aprendizaje'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual decorativo */}
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
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Empieza tu camino para convertirte en un experto
          </h2>
          <p className="text-lg text-blue-100 max-w-xl mx-auto">
            Unete a cientos de estudiantes que ya estan mejorando sus habilidades en 
            ingenieria de software con Requirement Master.
          </p>
          <Button
            onClick={handlePrimaryAction}
            className="px-10 py-4 text-lg font-semibold bg-white !text-blue-600 hover:!bg-blue-800 hover:!text-white shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 hover:border hover:border-white transition-all duration-300 rounded-xl cursor-pointer"
          >
            {isAuthenticated ? 'Ir al Roadmap' : 'Comenzar ahora'}
          </Button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-8 px-6 text-center text-sm text-gray-500 border-t border-gray-100">
        <p>&copy; {new Date().getFullYear()} Requirement Master. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}