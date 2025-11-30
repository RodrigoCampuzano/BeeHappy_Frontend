const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const getCalibracionesByColmena = async (idColmena) => {
  const token = sessionStorage.getItem('auth_token'); // ✅ Cambio de 'token' a 'auth_token'
  
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const res = await fetch(`${API_BASE_URL}/calibracion/colmena/${idColmena}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Error al obtener calibraciones:', errorText);
    throw new Error('Error al obtener calibraciones');
  }

  const data = await res.json();
  console.log('✅ Calibraciones obtenidas:', data);
  
  return data;
};
