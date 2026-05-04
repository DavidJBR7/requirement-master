import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../../../store/authStore';

export function useLogin() {
  const navigate = useNavigate();
  const loginToStore = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: (response, variables) => {
      loginToStore(response.accessToken, response.refreshToken, variables.rememberMe);
      navigate('/roadmap');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authService.register(data),
    onSuccess: () => navigate('/login', { state: { registered: true } }),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data) => authService.forgotPassword(data),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authService.resetPassword(data),
    onSuccess: () => navigate('/login'),
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  return async () => {
    try {
      await authService.logout(refreshToken ?? undefined);
    } catch {
      // incluso si falla, limpiamos estado local
    } finally {
      logout();
      navigate('/login');
    }
  };
}