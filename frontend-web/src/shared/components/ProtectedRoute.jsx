import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function ProtectedRoute({ children }) {
  // Derivamos si está autenticado a partir del token
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}