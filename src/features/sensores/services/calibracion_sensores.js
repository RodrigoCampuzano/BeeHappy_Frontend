const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const createCalibracion = async (calibrationData) => {
  const token = sessionStorage.getItem('auth_token'); // Ajusta el almacenamiento si usas otro método

  const response = await fetch(`${API_BASE_URL}/calibracion/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(calibrationData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al guardar calibración');
  }

  return response.json();
};
