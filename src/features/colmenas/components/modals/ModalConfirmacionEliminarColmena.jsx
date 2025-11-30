// ModalConfirmacionEliminarColmena.jsx
import React from 'react';
import eliminarImg from '/image-removebg.png';
import eliminaBg from '/Eliminar.png';
import { XCircle, Trash2 } from 'lucide-react'; // Iconos blancos

const ModalConfirmacionEliminarColmena = ({ visible, onClose, onConfirm, nombre, area, tipo, mensajeCustom }) => {
  if (!visible) return null;

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">

      <div
        className="relative rounded-xl shadow-2xl w-full max-w-xl text-center p-8 sm:p-10 bg-[#F7B440] bg-cover "
        style={{ backgroundImage: `url(${eliminaBg})` }}
      >
        {/* Imagen colmena */}
        <img src={eliminarImg} alt="Eliminar colmena" className="mx-auto mb-6 w-40 sm:w-44 z-10 relative" />

        {/* Título y texto */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
  {mensajeCustom || '¿Estás seguro de eliminar esta colmena?'}
</h2>

        <p className="text-gray-900 mb-1">Perderás toda la información relacionada a esta colmena.</p>
        <p className="text-blue-950 font-semibold mb-6">
          {nombre} – Área {area} – Tipo {tipo}
        </p>

        {/* Botones */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2 bg-[#063970] text-white font-medium rounded-md hover:bg-blue-900 transition"
          >
            <XCircle className="w-5 h-5 text-white" />
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2 bg-[#063970] text-white font-medium rounded-md hover:bg-blue-900 transition"
          >
            <Trash2 className="w-5 h-5 text-white" />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionEliminarColmena;
