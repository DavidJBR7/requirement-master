import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLogout } from '../../features/auth/hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { LogoIcon } from './LogoIcon';

const navItems = [
  {
    path: '/roadmap',
    label: 'Aprende',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    path: '/dashboard',
    label: 'Estadísticas',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Perfil',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export function Layout() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-blue-700 border-r border-blue-600 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-18' : 'w-66'
        }`}
      >
        {/* Logo y toggle */}
        <div className="p-4 border-b border-blue-600 flex items-center gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-blue-600 transition-colors flex-shrink-0"
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
          <LogoIcon className={`text-white`} />
          </button>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white truncate">Requirement Master</h1>
              {user && <p className="text-sm text-blue-200 truncate">Hola, <b>{user.username}</b></p>}
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-white hover:bg-blue-600 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Cerrar sesión */}
        <div className="p-3 border-t border-blue-600">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-3 text-md font-bold text-white hover:bg-red-900 hover:text-white rounded-xl transition-colors cursor-pointer"
            title={collapsed ? 'Cerrar sesión' : undefined}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="red">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto p-6 lg:p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}