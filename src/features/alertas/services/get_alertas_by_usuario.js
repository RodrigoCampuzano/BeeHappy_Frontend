// services/get_alertas_by_usuario.js
import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ALERTAS;

export const getAlertasByUsuario = async () => {
  const token = sessionStorageService.get('auth_token');
  const userId = sessionStorageService.get('user_id');

  if (!token || !userId) {
    throw new Error('Token o ID de usuario no disponibles');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/alertas/usuario/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) throw new Error("Error al obtener alertas por usuario");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo alertas por usuario:", error);
    return [];
  }
};
