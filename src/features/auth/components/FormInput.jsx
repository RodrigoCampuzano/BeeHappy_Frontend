import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const FormInput = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  disabled = false,
  showPasswordToggle = false,
  maxLength,
  className = ''
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputType = showPasswordToggle && isPasswordVisible ? 'text' : type;

  return (
    <div className={`mb-6 sm:mb-8 w-full ${className}`}>
      {label && (
        <label
          htmlFor={label.toLowerCase().replace(/\s/g, '-') + '-input'}
          className="block text-white text-left text-base sm:text-lg font-medium mb-2"
        >
          {label}
        </label>
      )}

      <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-3 sm:py-4 shadow-sm focus-within:ring-2 focus-within:ring-[#2A4D69]/30">
        {icon && <span className="text-gray-500 mr-3 text-xl">{icon}</span>}

        <input
          id={label ? label.toLowerCase().replace(/\s/g, '-') + '-input' : undefined}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className="flex-grow text-sm sm:text-base outline-none border-none bg-transparent placeholder-gray-400"
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-3 text-gray-500 hover:text-gray-700 text-xl focus:outline-none"
          >
            {isPasswordVisible ? <FiEye /> : <FiEyeOff />}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;
