const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const getColmenaSensoresByColmena = async (idColmena) => {
  const res = await fetch(`${API_BASE_URL}/colmena-sensores/`, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Error al obtener sensores');
  }

  const data = await res.json();
  return data.filter((rel) => rel.id_colmena === idColmena);
};
