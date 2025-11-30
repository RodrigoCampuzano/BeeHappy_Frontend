import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const toggleTwoFactorApi = async (estado) => {
  const token = sessionStorageService.get("auth_token");

  const response = await fetch(`${API_BASE_URL}/users/profile/2fa/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }), // true o false
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al cambiar verificación en dos pasos");
  }

  return await response.json(); // { message: "...éxito..." }
};
