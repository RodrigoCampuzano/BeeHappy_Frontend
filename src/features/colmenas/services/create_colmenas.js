const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const createColmena = async (nuevaColmena) => {
  const token = sessionStorage.getItem('auth_token'); // Asegúrate que esté guardado correctamente
  const url = `${API_BASE_URL}/colmena/`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(nuevaColmena)
  });

  console.log('➡️ Datos enviados al backend:', nuevaColmena);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la colmena');
  }

  return await response.json();
};
