import React from 'react';

const ModalConfirmacion = ({ visible, onClose, onConfirm, mensaje }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Confirmar</h2>
        <p className="mb-6">{mensaje}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
