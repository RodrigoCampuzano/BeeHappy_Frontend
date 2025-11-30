// src/components/EmailInput.jsx
import React from 'react';
import { FiMail } from 'react-icons/fi';

export default function EmailInput({ value, onChange, disabled = false }) {
  return (
    // Añadimos w-full aquí para que ocupe todo el ancho disponible del padre (max-w-2xl)
    <div className="mb-10 w-full">
      <div className="flex items-center border-4 border-[#013A55] rounded-lg py-4 px-4 shadow-sm
                focus-within:border-[#2A4D69] focus-within:ring-2 focus-within:ring-[#9ac5e8]/30">

        <FiMail className="text-black mr-5 text-4xl" />

<input
  type="email"
  value={value}
  onChange={(e) => onChange(e.target.value)}
  disabled={disabled}
  placeholder="Email"
  className="flex-grow text-base sm:text-lg md:text-xl lg:text-2xl font-semibold border-none text-black placeholder-black bg-transparent outline-none min-w-0"
/>



      </div>
    </div>
  );
}