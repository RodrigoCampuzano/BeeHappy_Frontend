import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const requestPasswordChange = async (currentPassword) => {
  const token = sessionStorageService.get("auth_token");

  const response = await fetch(`${API_BASE_URL}/users/profile/password/change/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ current_password: currentPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al solicitar cambio de contraseña");
  }
  return await response.json();
};

