// src/shared/components/Button.jsx
import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled,
  variant = 'primary',
  fullWidth = true, // Nueva prop opcional
}) => {
  let buttonClasses = `
    ${fullWidth ? 'w-full' : 'w-auto'}
    px-4 py-3 sm:py-3 md:py-4
    rounded-md
    text-base sm:text-lg font-bold
    transition-colors duration-200
    ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-400' : 'cursor-pointer'}
  `;

  if (variant === 'primary') {
    buttonClasses += ' bg-[#2A4D69] text-white hover:bg-[#203e54] shadow-md';
  } else if (variant === 'secondary') {
    buttonClasses += ' bg-[#F7B440] text-[#1A2B4C] hover:bg-[#FFD700]';
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={buttonClasses}>
      {children}
    </button>
  );
};

export default Button;
