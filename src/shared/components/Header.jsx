import { useNavigate } from "react-router-dom"; 
import { ArrowLeft, LogOut, User,Headset } from "lucide-react";
import { useAuth } from "../../app/providers/authProvider";
import { useState } from "react";
import { X, CheckCircle } from 'lucide-react';

export const Header = ({ title, showBack = false }) => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const goToAsistente = () => {
    window.open("https://asistente-sencillo.vercel.app", "_blank");
  };

  return (
    <>
<header className="w-full border-b border-white/70 px-4 py-4 text-white">
  <div className="flex items-center justify-between md:justify-between gap-4 w-full">

    {/* Volver + Título */}
    <div className="flex items-center gap-2 md:w-1/3">
      {showBack && (
        <button
          onClick={() => navigate("/colmenas")}
          className="flex items-center gap-1 hover:text-yellow-300 text-sm"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>
      )}
      <h1
        className="text-xl font-semibold md:text-3xl whitespace-nowrap"
        style={{ marginLeft: showBack ? '1rem' : '3rem' }} // <-- más espacio si NO hay botón volver
      >
        {title}
      </h1>
    </div>

    {/* Botón / Ícono Asistente */}
    <div className="flex justify-center md:w-1/3">
      <button
        onClick={goToAsistente}
        className="bg-yellow-500 hover:bg-yellow-600 text-[#0B1D31] font-semibold px-2 py-2 rounded-lg text-sm shadow md:px-4 md:py-2 md:text-sm flex items-center justify-center"
        title="Asistente"
      >
        <Headset size={20} className="md:hidden" />
        <span className="hidden md:inline">Asistente</span>
      </button>
    </div>

    {/* Avatar solo mobile + usuario en desktop */}
    <div className="flex items-center justify-end gap-2 md:w-1/3">
      <div className="block md:hidden">
        <button onClick={() => setShowModal(true)}>
          <img src="/avatar.png" alt="User" className="w-9 h-9 rounded-full border border-white" />
        </button>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <div className="text-sm text-right">
          <p className="text-xs">Bienvenido</p>
          <p className="font-bold">{usuario}</p>
        </div>
        <button title="Ver perfil" onClick={() => navigate("/perfil")} className="hover:text-yellow-300">
          <User />
        </button>
        <button title="Cerrar sesión" onClick={() => setShowLogoutModal(true)}>
          <LogOut className="hover:text-yellow-300" />
        </button>
      </div>
    </div>

  </div>
</header>



      {/* Modal móvil */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center md:hidden">
          <div className="bg-[#0B547A] text-white rounded-xl shadow-lg p-6 w-[85%] max-w-xs">
            <div className="flex flex-col items-center gap-4">
              <img src="/avatar.png" alt="User" className="w-20 h-20 rounded-full border border-white" />
              <p className="font-semibold text-lg">{usuario}</p>
              <button className="flex items-center gap-2 text-white hover:text-yellow-300" onClick={() => { navigate("/perfil"); setShowModal(false); }}>
                <User size={20} />
                <span>Perfil</span>
              </button>
              <button className="flex items-center gap-2 text-white hover:text-yellow-300" onClick={() => { setShowLogoutModal(true); setShowModal(false); }}>
                <LogOut size={20} />
                <span>Cerrar sesión</span>
              </button>
              
              <button className="mt-4 text-sm text-white/70 hover:text-white" onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div
            className="relative bg-[#0B547A] text-white rounded-2xl p-6 w-[90%] max-w-md flex flex-col items-center gap-4"
            style={{ backgroundImage: 'url("/Cerrar.png")', backgroundSize: 'cover' }}
          >
            <img src="/hive.png" alt="Cerrar sesión" className="w-50 h-40" />
            <p className="text-lg font-semibold">¿Estás seguro de cerrar la sesión?</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-yellow-500 hover:bg-yellow-600 text-[#0B1D31] font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X className="w-5 h-5 text-[#0B1D31]" />
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="bg-yellow-500 hover:bg-yellow-600 text-[#0B1D31] font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <CheckCircle size={20} className="text-[#0B1D31]" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
