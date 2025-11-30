const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export async function getColmenaConSensores(idColmena) {
  const token = sessionStorage.getItem('auth_token'); // o de donde tengas el token

  const res = await fetch(`${API_BASE_URL}/colmena/${idColmena}/sensores`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`Error al obtener colmena con sensores: ${res.statusText}`);

  const data = await res.json();
  return data; // { colmena: {...}, sensores: [...] }
}
