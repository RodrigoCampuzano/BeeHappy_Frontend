const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const updateColmenaSensor = async (id, data) => {
  const token = sessionStorage.getItem('auth_token');
  const url = `${API_BASE_URL}/colmena-sensores/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error actualizando relación colmena-sensor: ${response.statusText}`);
  }

  return await response.json();
};
