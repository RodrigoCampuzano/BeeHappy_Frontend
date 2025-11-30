const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const updateColmena = async (id, data) => {
     const token = sessionStorage.getItem('auth_token'); // Asegúrate de que esté guardado


  const response = await fetch(`${API_BASE_URL}/colmena/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar colmena: ${response.statusText}`);
  }

  return await response.json();
};
