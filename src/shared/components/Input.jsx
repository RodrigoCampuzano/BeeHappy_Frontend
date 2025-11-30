import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  options = [],
  checked,
  rows = 4,
  labelClassName = '',
  inputClassName = '',
  containerClassName = '',
  disabled = false, // 👈 Añadir prop disabled
}) => {
  const baseInputClasses = `
    w-full px-4 py-3 rounded-md text-base sm:text-lg font-semibold outline-none box-border
    border-2 transition-all duration-200
    ${error
      ? 'border-[#FF6347] focus:border-[#FF6347] focus:ring-2 focus:ring-[#FF6347]/30'
      : 'border-white focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30'
    }
    placeholder-[#9aabc2]
    ${disabled ? 'bg-[#8da3c1] cursor-not-allowed text-gray-700' : ''}
  `;

  const inputTextColor = type === 'select'
    ? 'text-black bg-white'
    : 'text-white bg-[#0C3F72]';

  const finalInputClasses = `${baseInputClasses} ${inputTextColor} ${inputClassName}`;

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={name}
          className={`text-white text-sm sm:text-base font-semibold mb-2 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled} // ✅ aplicar disabled
          className={finalInputClasses}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled} // ✅ aplicar disabled
          className={finalInputClasses}
        >
          <option value="" disabled className="text-gray-400">
            Seleccionar
          </option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="text-black">
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' || type === 'radio' ? (
        <div className="flex items-center gap-2">
          <input
            id={name}
            name={name}
            type={type}
            checked={checked}
            onChange={onChange}
            disabled={disabled} // ✅ aplicar disabled
            className={`form-${type} h-5 w-5 text-yellow-500 bg-[#1A2B4C] border-gray-600 rounded focus:ring-yellow-500 ${inputClassName}`}
          />
          <label htmlFor={name} className={`text-white text-sm sm:text-base ${labelClassName}`}>
            {placeholder}
          </label>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled} // ✅ aplicar disabled
          className={finalInputClasses}
        />
      )}
    </div>
  );
};

export default Input;
