const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const deleteColmenaService = async (id) => {
  const token = sessionStorage.getItem('auth_token'); // Asegúrate que la key sea la correcta
  const url = `${API_BASE_URL}/colmena/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  // Si es exitoso (204 o 200), simplemente retorna
  if (response.status === 204 || response.ok) {
    return;
  }

  // Si no fue exitoso, intenta parsear el error
  const errorData = await response.json();
  throw new Error(errorData.message || errorData.error || 'Error al eliminar la colmena');
};
