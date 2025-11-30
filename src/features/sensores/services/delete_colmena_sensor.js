import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const deleteColmenaSensor = async (idRelacion) => {
  const token = sessionStorageService.get('auth_token');

  const res = await fetch(`${API_BASE_URL}/colmena-sensores/${idRelacion}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Error al eliminar relación:', errorText);
    throw new Error('Error al eliminar la relación colmena-sensor');
  }

  return true;
};
