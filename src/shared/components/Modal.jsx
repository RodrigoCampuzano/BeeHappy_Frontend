import React from 'react';

function Modal({ isOpen, title, message, onClose, showCloseButton = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center max-h-[60vh] overflow-auto">
        <h2 className="text-2xl font-bold text-[#0E103F] mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="bg-[#0E103F] text-white px-6 py-2 rounded-lg hover:bg-[#1C1F66]"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}

export default Modal;
