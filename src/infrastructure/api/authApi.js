const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: credentials.usuario,
        contrasena: credentials.contrasena,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    return data;
  },

  verify2FA: async ({ code, email }) => {
    const response = await fetch(`${API_BASE_URL}/users/login/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en verificación 2FA');
    }

    const data = await response.json();
    return data;
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('mac_raspberry');
  },

  getCurrentUsuario: () => {
    return sessionStorage.getItem('usuario');
  },
};
