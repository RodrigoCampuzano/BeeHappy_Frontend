import React, { useRef } from 'react';

export default function CodeInput({ value, onChange }) {
  const inputRefs = useRef([]);

  const handleChange = (e, i) => {
    const inputValue = e.target.value.replace(/\D/, '');
    const newCode = value.split('');
    newCode[i] = inputValue;
    onChange(newCode.join(''));

    if (inputValue && i < 5) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !e.target.value && i > 0) {
      inputRefs.current[i - 1].focus();
    }
  };

  return (
  <div className="flex justify-center gap-2 my-12 px-8 w-full  sm:flex-wrap">

      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="tel"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="
  w-8 h-8          /* Tamaño por defecto (para móviles) */
  sm:w-20 sm:h-20     /* Tamaño grande a partir de sm (>= 640px) */
  text-center
  text-3xl sm:text-5xl
  font-bold
  text-[#1A2B4C]
  bg-white
  border-b-2 border-gray-300
  rounded-lg
  focus:border-[#2A4D69]
  focus:ring-2 focus:ring-[#2A4D69]/30
  outline-none
  transition-all duration-200 ease-in-out
  shadow-md
"

          style={{ boxShadow: '0px 2px 5px rgba(0,0,0,0.15)' }}
        />
      ))}
    </div>
  );
}
