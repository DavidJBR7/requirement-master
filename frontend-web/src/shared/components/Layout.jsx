import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLogout } from '../../features/auth/hooks/useAuth';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { path: '/roadmap', label: 'Aprende'},
  { path: '/dashboard', label: 'Estadísticas'},
  { path: '/profile', label: 'Perfil'},
];

export function Layout() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-700">Requirement Master</h1>
          {user && <p className="text-sm text-gray-600 mt-1">Hola, {user.username}</p>}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}