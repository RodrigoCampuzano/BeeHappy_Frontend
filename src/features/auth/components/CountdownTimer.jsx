// src/components/CountdownTimer.jsx
import React from 'react';

export default function CountdownTimer({ seconds, onResend }) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="text-center mt-10 text-xl text-gray-700">
      {seconds > 0 ? (
        <p>
          Reenviar código en{' '}
          <span className="font-bold text-[#2A4D69]">
            {minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
          </span>
        </p>
      ) : (
        <button
          onClick={onResend}
          className="text-[#2A4D69] font-semibold underline hover:text-blue-700 transition-colors text-xl"
        >
          Reenviar código
        </button>
      )}
    </div>
  );
}