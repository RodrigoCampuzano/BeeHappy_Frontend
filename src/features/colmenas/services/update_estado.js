// services/updateEstadoColmena.js
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const updateEstadoColmena = async (id_colmena, nuevoEstado) => {
  const token = sessionStorage.getItem('auth_token'); // O donde tengas almacenado el token

  const response = await axios.put(
    `${API_BASE_URL}/colmena/${id_colmena}/estado`,
    { estado: nuevoEstado },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};
