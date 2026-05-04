import apiClient from '../../../services/apiClient';

export const authService = {
  login: (data) => apiClient.post('/auth/login', data).then((res) => res.data),
  register: (data) => apiClient.post('/auth/register', data).then((res) => res.data),
  refreshToken: (refreshToken) =>
    apiClient.post('/auth/refresh-token', { refreshToken }).then((res) => res.data),
  logout: (refreshToken) => apiClient.post('/auth/logout', { refreshToken }),
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data).then((res) => res.data),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data).then((res) => res.data),
};