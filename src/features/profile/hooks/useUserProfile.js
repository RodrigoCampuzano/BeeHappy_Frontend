import { useState, useEffect } from "react";
import { getUserProfile } from "../services/get_user";
import { requestPasswordChange } from "../services/request_password_change";
import { changePassword } from "../services/change_password";
import { sessionStorageService } from "../../../infrastructure/storage/sessionStorage";

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  const [loadingChange, setLoadingChange] = useState(false);
  const [errorChange, setErrorChange] = useState(null);
  const [messageChange, setMessageChange] = useState(null);
  const [stepChange, setStepChange] = useState(1);

  const [currentPassword, setCurrentPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);

      try {
        const userId = sessionStorageService.get("user_id");
        if (!userId) throw new Error("No se pudo obtener el ID del usuario");

        const data = await getUserProfile(userId);
        console.log("✅ Perfil cargado:", data);
        setProfile(data);
      } catch (err) {
        setErrorProfile(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const requestCode = async () => {
    setLoadingChange(true);
    setErrorChange(null);
    setMessageChange(null);

    try {
      await requestPasswordChange(currentPassword);
      setMessageChange("Código enviado. Revisa tu correo.");
      setStepChange(2);
    } catch (err) {
      setErrorChange(err.message);
    } finally {
      setLoadingChange(false);
    }
  };

  const submitChangePassword = async () => {
  setLoadingChange(true);
  setErrorChange(null);
  setMessageChange(null);

  try {
    if (!profile?.correo_electronico) {
      throw new Error("No se pudo obtener el correo del usuario. Intenta nuevamente.");
    }

    const email = profile.correo_electronico;

    console.log("📤 Enviando cambio de contraseña con:", {
      code,
      email,
      new_password: newPassword,
    });

    const response = await changePassword({ code, email, new_password: newPassword });

    setMessageChange(response.message || "Contraseña cambiada con éxito.");
    setStepChange(1);
    setCurrentPassword("");
    setCode("");
    setNewPassword("");
  } catch (err) {
    console.error("❌ Error en cambio de contraseña:", err);
    setErrorChange(err.message);
  } finally {
    setLoadingChange(false);
  }
};

  return {
    profile,
    loadingProfile,
    errorProfile,
    currentPassword,
    setCurrentPassword,
    code,
    setCode,
    newPassword,
    setNewPassword,
    loadingChange,
    errorChange,
    messageChange,
    stepChange,
    setStepChange,
    requestCode,
    submitChangePassword,
  };
};
