// shared/components/GuestRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);

  if (isAuthenticated) {
    return <Navigate to="/roadmap" replace />;
  }

  return <Outlet />;
}