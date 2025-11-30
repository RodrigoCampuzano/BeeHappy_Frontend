// src/components/PasswordInput.jsx
import React, { useState } from 'react';

export default function PasswordInput({ value, onChange, placeholder = "Nueva contraseña" }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    // Añadimos w-full aquí
    <div className="mb-10 w-full">
      <div className="flex items-center bg-[#D5D5D5D9] border border-gray-300 rounded-lg py-6 px-6 shadow-sm
                      focus-within:border-[#2A4D69] focus-within:ring-2 focus-within:ring-[#2A4D69]/30">
        <span className="text-gray-500 mr-5 text-4xl">🔒</span>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-grow text-2xl outline-none border-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="ml-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );
}