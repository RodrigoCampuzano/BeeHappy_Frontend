const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ALERTAS;
import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";

export const getAlertasByMac = async () => {
  const token = sessionStorageService.get('auth_token');
  const mac = sessionStorageService.get('mac_raspberry'); // <-- correctamente recuperado de sessionStorage

  if (!token || !mac) {
    throw new Error('Token o MAC de Raspberry no disponibles');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/alertas/mac/${encodeURIComponent(mac)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) throw new Error("Error al obtener alertas");

    const data = await response.json();
    return data; // ← Aquí ya retorna el arreglo de alertas del backend
  } catch (error) {
    console.error("Error obteniendo alertas:", error);
    return [];
  }
};
