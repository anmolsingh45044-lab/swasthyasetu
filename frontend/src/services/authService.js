import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  switchMode: (mode) => api.put('/auth/switch-mode', { mode }),
  updateProfile: (data) => api.put('/auth/profile', data)
};
