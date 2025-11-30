import React from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

function ToastMessage({ type = 'success', title, message, onClose }) {
  const bgColor = {
    success: 'bg-[#01445C]',
    error: 'bg-red-600',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertTriangle,
    warning: AlertTriangle,
    info: AlertTriangle,
  }[type];

  return (
    <div
      className={clsx(
        'fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-3 w-[90%] max-w-md animate-slide-in',
        bgColor
      )}
    >
      <div className="pt-1">
        <Icon size={24} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        <p className="text-sm">{message}</p>
      </div>
      <button
        className="text-white text-lg"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        <X size={20} />
      </button>
    </div>
  );
}

export default ToastMessage;
