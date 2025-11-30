import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const getColmenaById = async (id) => {
  const token = sessionStorageService.get('auth_token');

  if (!token) {
    throw new Error('Token no encontrado. Debes iniciar sesión.');
  }

  const response = await fetch(`${API_BASE_URL}/colmena/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error || `Error al obtener la colmena con ID ${id}`;
    throw new Error(message);
  }

  const data = await response.json();

  // ✅ Guarda la MAC usando la propiedad correcta del backend
  if (data.mac_raspberry) {
    sessionStorageService.set('mac_raspberry', data.mac_raspberry);
    console.log('MAC Address guardada en sessionStorage:', data.mac_raspberry);
  }

  return data;
};
