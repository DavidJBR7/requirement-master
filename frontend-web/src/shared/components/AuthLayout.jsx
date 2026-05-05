import { LogoIcon } from './LogoIcon';

export default function AuthLayout({ children, currentPage }) {
  const pageInfo = {
    login: {
      title: 'Iniciar sesión',
      subtitle: 'Ingresa a tu cuenta para continuar aprendiendo.',
      linkText: '¿No tienes cuenta?',
      linkTo: '/register',
      linkLabel: 'Registrate',
    },
    register: {
      title: 'Crear cuenta',
      subtitle: 'Registrate y empieza tu viaje de aprendizaje.',
      linkText: '¿Ya tienes cuenta?',
      linkTo: '/login',
      linkLabel: 'Iniciar sesión',
    },
    'forgot-password': {
      title: 'Recuperar contraseña',
      subtitle: 'Te enviaremos un código para restablecer tu contraseña.',
      linkText: '',
      linkTo: '/login',
      linkLabel: 'Volver al inicio de sesión',
    },
    'reset-password': {
      title: 'Restablecer contraseña',
      subtitle: 'Ingresa el código recibido y tu nueva contraseña.',
      linkText: '',
      linkTo: '/login',
      linkLabel: 'Volver al inicio de sesión',
    },
  };

  const info = pageInfo[currentPage] || pageInfo.login;

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden items-center justify-center p-12">
        {/* Formas decorativas */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-blue-300/20 rounded-full blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 800 800"
          fill="none"
        >
          <circle cx="400" cy="400" r="300" stroke="white" strokeWidth="2" />
          <circle cx="400" cy="400" r="200" stroke="white" strokeWidth="2" />
          <circle cx="400" cy="400" r="100" stroke="white" strokeWidth="2" />
          <line x1="100" y1="400" x2="700" y2="400" stroke="white" strokeWidth="1" />
          <line x1="400" y1="100" x2="400" y2="700" stroke="white" strokeWidth="1" />
        </svg>

        <div className="relative z-10 text-center text-white space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <LogoIcon className={`text-white`} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Requirement Master</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            "La calidad de los requerimientos define la calidad del software. 
            Aprende a hacerlo bien desde el principio."
          </p>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white ">
        <div className="w-full max-w-md border border-blue-600 p-10 rounded-xl shadow-xl">
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Requirement Master</h2>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{info.title}</h2>
          <p className="text-gray-600 mb-8">{info.subtitle}</p>

          {children}

          <p className="mt-6 text-center text-sm text-gray-600">
            {info.linkText}{' '}
            {info.linkText && (
              <a href={info.linkTo} className="text-blue-600 hover:underline font-medium">
                {info.linkLabel}
              </a>
            )}
            {!info.linkText && (
              <a href={info.linkTo} className="text-blue-600 hover:underline font-medium">
                {info.linkLabel}
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}