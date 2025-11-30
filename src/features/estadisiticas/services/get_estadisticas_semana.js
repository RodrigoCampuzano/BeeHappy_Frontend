import { sessionStorageService } from '../../../infrastructure/storage/sessionStorage';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_ESTADISTICAS;

export const getEstadisticasSemana = async () => {
  const token = sessionStorageService.get('auth_token');
  const mac = sessionStorageService.get('mac_raspberry');

  if (!token || !mac) {
    throw new Error('Token o MAC de Raspberry no disponibles');
  }

  const url = `${API_BASE_URL}/estadisticas/semana?mac_raspberry=${encodeURIComponent(mac)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al obtener estadísticas diarias: ${error}`);
  }

  const json = await response.json();

  if (!Array.isArray(json.data)) {
    console.warn("⚠️ 'data' vino como null para estadísticas diarias. Retornando []");
    return [];
  }

  return json.data;
};
