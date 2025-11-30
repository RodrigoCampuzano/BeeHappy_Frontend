import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

const token = sessionStorageService.get('auth_token')
export const getColmenaSensores = async () => {
  const res = await fetch(`${API_BASE_URL}/colmena-sensores/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Error al obtener colmena-sensores');
  return res.json();
};
