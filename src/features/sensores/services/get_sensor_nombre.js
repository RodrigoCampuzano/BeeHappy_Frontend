const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const obtenerIdSensorPorNombre = async (nombreSensor) => {
  const token = sessionStorage.getItem('auth_token');

  const response = await fetch(`${API_BASE_URL}/tipos-sensores/nombre/${nombreSensor}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener el ID del sensor');
  }

  const data = await response.json();
  return data.id;
};
