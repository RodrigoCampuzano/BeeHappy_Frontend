const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;


export const createColmenaSensor = async (data) => {
  const token = sessionStorage.getItem('auth_token');

  const response = await fetch(`${API_BASE_URL}/colmena-sensores/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al asociar sensor');
  }

  const result = await response.json();
  return result;
};
