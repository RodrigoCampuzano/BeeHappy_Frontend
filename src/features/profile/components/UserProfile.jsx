import React, { useState } from "react";
import ToastMessage from "../../../shared/components/Modals/ToastMessage";
import { PencilIcon } from "@heroicons/react/24/outline";

const UserProfile = ({
  profile,
  onChangePasswordClick,
  onEditProfileClick,
  toggleTwoFactorService,
}) => {
  if (!profile) return null;

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(profile.verificacion_dos_pasos);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [toast, setToast] = useState({
  visible: false,
  type: "success", // 'success', 'error', 'warning', 'info'
  title: "",
  message: "",
});


const handleToggleTwoFactor = async () => {
  setLoadingToggle(true);
  try {
    const nuevoEstado = !twoFactorEnabled;
    const response = await toggleTwoFactorService(nuevoEstado);

    setToast({
      visible: true,
      type: "success",
      title: "Éxito",
      message: response.message || "Operación exitosa",
    });

    setTwoFactorEnabled(nuevoEstado);
  } catch (error) {
    setToast({
      visible: true,
      type: "error",
      title: "Error",
      message: "Error al cambiar verificación en dos pasos: " + error.message,
    });
  }
  setLoadingToggle(false);
};


  return (
    <div className="max-w-4xl mx-auto bg-[#1F4E79] text-white rounded-xl shadow-lg p-6 md:p-8 mt-6 relative">
      {/* Botón editar */}
      

      {/* Perfil principal */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src="/avatar-placeholder.png"
          alt="avatar"
          className="w-32 h-32 rounded-full bg-gray-100"
        />
        <div>
          <h2 className="text-2xl font-semibold">
            {profile.nombres} {profile.apellidos}
          </h2>
          <p className="text-lg mt-1">{profile.rol}</p>
        </div>
      </div>

      {/* Información */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-base">
        <div>
          <p className="text-gray-300">Nombre(s):</p>
          <p className="font-medium">{profile.nombres}</p>
        </div>
        <div>
          <p className="text-gray-300">Apellidos:</p>
          <p className="font-medium">{profile.apellidos}</p>
        </div>
        <div>
          <p className="text-gray-300">Rol:</p>
          <p className="font-medium">{profile.rol}</p>
        </div>
        <div>
          <p className="text-gray-300">Correo electrónico:</p>
          <p className="font-medium">{profile.correo_electronico}</p>
        </div>
        <div>
          <p className="text-gray-300 mb-1">Verificación en dos pasos:</p>

          <div className="flex items-center gap-4">
            <span className="font-medium">
              {twoFactorEnabled ? "Activada" : "Desactivada"}
            </span>

            {/* Switch visual */}
            <button
              onClick={handleToggleTwoFactor}
              disabled={loadingToggle}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                twoFactorEnabled ? "bg-green-500" : "bg-gray-400"
              } ${loadingToggle ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  twoFactorEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onChangePasswordClick}
          className="text-sm underline hover:text-blue-200 transition"
          disabled={loadingToggle}
        >
          Cambiar contraseña
        </button>
      </div>
      {toast.visible && (
        <ToastMessage
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </div>
  );
};

export default UserProfile;
