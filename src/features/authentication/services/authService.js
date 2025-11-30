// src/features/authentication/services/authService.js
import { authApi } from '../../../infrastructure/api/authApi';
import { sessionStorageService } from '../../../infrastructure/storage/sessionStorage';

export const authService = {
  login: async (credentials) => {
    const response = await authApi.login(credentials);

    // Si no requiere 2FA, guardar token directo
    if (!response.require_two_factor) {
      sessionStorageService.set('auth_token', response.token);
      sessionStorageService.set('usuario', credentials.usuario);
      sessionStorageService.set('user_id', response.id);
    } else {
      sessionStorageService.set('usuario', response.email); // para luego usarlo en verify2FA
      sessionStorageService.set('usuario', credentials.usuario); // para luego usarlo en verify2FA


    }

    return response;
  },

  verify2FA: async ({ code, email }) => {
    const response = await authApi.verify2FA({ code, email });

    sessionStorageService.set('auth_token', response.token);
    sessionStorageService.set('user_id', response.id);

    const usuario = sessionStorageService.get('usuario');
    return {
      usuario,
      id: response.id,
    };
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      sessionStorageService.remove('auth_token');
      sessionStorageService.remove('usuario');
      sessionStorageService.remove('id');
      sessionStorageService.remove('mac_rasberry')
      sessionStorageService.remove('user_id')
    }
  },

  getCurrentUsuario: () => {
    return sessionStorageService.get('usuario');
  },

  getToken: () => {
    return sessionStorageService.get('auth_token');
  },

  isAuthenticated: () => {
    return !!sessionStorageService.get('auth_token');
  },
};
