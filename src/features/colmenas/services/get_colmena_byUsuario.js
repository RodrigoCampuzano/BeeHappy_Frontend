const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";
export const getColmenaByUsuario = async () => {
  const token = sessionStorageService.get('auth_token');
  const usuarioID = sessionStorageService.get('user_id');

  if (!token) {
    throw new Error('Token no encontrado. Debes iniciar sesión.');
  }

  const response = await fetch(`${API_BASE_URL}/colmena/usuario/${usuarioID}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error || 'Error al obtener las colmenas del usuario';
    throw new Error(message);
  }

  const data = await response.json();
  console.log('Respuesta API getColmenaByUsuario:', data);

  // Aquí el array está dentro de "colmenas"
  const colmenas = data.colmenas || [];

  // Guarda la mac_raspberry de la primera colmena que tenga
  if (colmenas.length > 0 && colmenas[0].mac_raspberry) {
    sessionStorageService.set('mac_raspberry', colmenas[0].mac_raspberry);
    console.log('MAC Address guardada en sessionStorage:', colmenas[0].mac_raspberry);
  }

  return colmenas;
};
