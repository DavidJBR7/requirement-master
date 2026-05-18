import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useLogout } from "../../features/auth/hooks/useAuth";
import { useAuthStore } from "../../store/authStore";
import { LogoIcon } from "./LogoIcon";
import { SignOut, X } from "@phosphor-icons/react";

const navItems = [
  {
    path: "/roadmap",
    label: "Aprende",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    path: "/dashboard",
    label: "Estadísticas",
    icon: (
      <svg
        className="w-5 h-5"
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
  },
  {
    path: "/profile",
    label: "Perfil",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

export function Layout() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);

      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const sidebarClasses = `
    fixed top-0 left-0 z-50 h-full
    flex flex-col
    bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800
    transition-all duration-300 ease-in-out
    shadow-2xl
    ${
      isMobile
        ? `${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} w-80`
        : `${collapsed ? "w-18" : "w-66"} relative`
    }
  `;

  const overlayClasses = `
    fixed inset-0 bg-black z-40
    transition-opacity duration-300
    ${
      isMobile && mobileMenuOpen
        ? "opacity-50 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
  `;

  return (
    <div className="flex h-screen bg-[#f8faff] overflow-hidden">
      {/* Overlay móvil */}
      <div
        className={overlayClasses}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="p-4 border-b border-blue-500/40 flex items-center gap-3">
          <button
            onClick={() => {
              if (isMobile) {
                setMobileMenuOpen(false);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-700 hover:bg-blue-600 transition-colors flex-shrink-0 cursor-pointer"
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <LogoIcon className="text-white" />
          </button>

          {(!collapsed || isMobile) && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white truncate">
                Requirement Master
              </h1>

              {user && (
                <p className="text-sm text-blue-100 truncate">
                  Hola, <b>{user.username}</b>
                </p>
              )}
            </div>
          )}

          {isMobile && mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-600 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed && !isMobile ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  collapsed && !isMobile ? "justify-center" : "justify-start"
                } ${
                  isActive
                    ? "bg-white text-blue-700 shadow-lg"
                    : "text-white hover:bg-blue-600/80 hover:text-white"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>

                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-blue-500/40">
          <button
            onClick={logout}
            title={collapsed && !isMobile ? "Cerrar sesión" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-md font-bold text-white transition-all duration-200 cursor-pointer ${
              collapsed && !isMobile ? "justify-center" : "justify-start"
            } hover:bg-red-900`}
          >
            <SignOut className="w-5 h-5 flex-shrink-0" />

            {(!collapsed || isMobile) && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="relative flex-1 overflow-auto bg-[#f8faff]">
        {/* Fondo decorativo */}
        <div
          className={`pointer-events-none fixed top-0 right-0 bottom-0 overflow-hidden transition-all duration-300 ease-in-out ${
            isMobile ? "left-0" : collapsed ? "left-[72px]" : "left-[264px]"
          }`}
        >
          {/* Blobs */}
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-blue-100" />

          <div className="absolute bottom-[-180px] left-[-120px] w-[420px] h-[420px] rounded-full bg-blue-100" />

          <div className="absolute -top-24 right-[-120px] w-[340px] h-[340px] rounded-full bg-slate-100" />

          {/* Glow inferior derecha */}
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full" />

          {/* Líneas SVG */}
          <svg
            className="absolute left-0 top-40"
            width="500"
            height="700"
            viewBox="0 0 500 700"
            fill="none"
          >
            <path
              d="M100 0C250 100 50 250 180 380C300 500 120 620 260 700"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="8 10"
            />
          </svg>

          <svg
            className="absolute right-10 bottom-20"
            width="300"
            height="300"
            viewBox="0 0 300 300"
            fill="none"
          >
            <path
              d="M40 240C120 180 180 300 260 220"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="8 10"
            />
          </svg>

          {/* Círculos */}
          <div className="absolute top-20 left-28 w-10 h-10 rounded-full border-2 border-blue-200" />

          <div className="absolute top-72 right-96 w-5 h-5 rounded-full border border-blue-200" />

          <div className="absolute bottom-60 left-60 w-4 h-4 rounded-full bg-blue-100" />

          {/* Puntos arriba derecha */}
          <div className="absolute top-20 right-24 grid grid-cols-4 gap-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            ))}
          </div>

          {/* Puntos abajo izquierda */}
          <div className="absolute bottom-20 left-24 grid grid-cols-4 gap-4 opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            ))}
          </div>

          {/* Tarjeta flotante */}
          <div className="absolute right-24 top-[38%] rotate-12 bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-5 border border-blue-100 opacity-80 hidden lg:block">
            <div className="flex items-end gap-2 h-14">
              <div className="w-4 h-8 bg-blue-400 rounded-sm" />
              <div className="w-4 h-12 bg-blue-500 rounded-sm" />
              <div className="w-4 h-16 bg-blue-600 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Botón móvil */}
        {isMobile && !mobileMenuOpen && (
          <div className="fixed bottom-3 left-4 z-30 p-0.5 rounded-full border-4 border-blue-600 flex">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full shadow-lg transition-colors md:hidden cursor-pointer"
              aria-label="Abrir menú"
            >
              <LogoIcon className="w-8 h-8" />
            </button>
          </div>
        )}

        {/* Contenido */}
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
