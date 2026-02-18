import api from './api';
import type { LoginResponse } from '../types/auth';

export const authService = {
  async login(credentials: any): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const { sessionToken, refreshToken, user } = response.data;

    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userRole', user.role);

    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
    }
  },

  getCurrentUser() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) return null;

    return {
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole'),
    };
  }
};
