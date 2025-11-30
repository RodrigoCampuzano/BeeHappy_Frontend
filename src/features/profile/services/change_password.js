import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const token = sessionStorageService.get("auth_token");

export const changePassword = async ({ code, email, new_password }) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/password/change`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code, email, new_password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al cambiar la contraseña");
  }
  return await response.json();
};
