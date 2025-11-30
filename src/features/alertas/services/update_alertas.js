const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ALERTAS;
import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";

export const updateAlertaEstado = async (id, nuevoEstado) => {
  const token = sessionStorageService.get('auth_token');
  if (!token) throw new Error('Token no disponible');

  try {
    const response = await fetch(`${API_BASE_URL}/alertas/${id}/estado`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al actualizar el estado');
    }

    return await response.json(); // o lo que retorne el backend
  } catch (error) {
    console.error('Error actualizando estado:', error);
    throw error;
  }
};
