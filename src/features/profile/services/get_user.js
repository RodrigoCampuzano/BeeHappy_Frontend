// services/get_user.js
import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async (id) => {
  const token = sessionStorageService.get("auth_token");

  const url = `${API_BASE_URL}/users/profile/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el perfil del usuario");
  }

  return await response.json();
};
