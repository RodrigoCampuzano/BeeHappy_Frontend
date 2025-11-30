import React from 'react';

function SensorCard({ icon, label, value, unit, iconColor }) {
  // Estilo adaptativo para el sensor de Peso
  if (label === 'Peso') {
    return (
      <div className="bg-[#B6B6B6] text-[#0B1D31] rounded-xl p-6 shadow-lg flex flex-col items-center justify-center w-full md:flex-row md:items-center md:justify-between min-h-[120px]">
        <div className="flex flex-col items-center md:flex-row md:items-center gap-2 md:gap-4 mb-2 md:mb-0">
          <div className={`${iconColor} w-14 h-14`}>
            {icon}
          </div>
          <p className="text-4xl font-semibold">{label}</p>
        </div>

        <hr className="border-t border-gray-300 w-2/3 my-2 md:w-px md:h-16 md:mx-6 md:border-l md:border-t-0" />

        <div>
          <h1 className="text-7xl font-semibold text-[#0B3B55] text-center md:text-right">
            {value != null ? `${value} ${unit}` : '...'}
          </h1>
        </div>
      </div>
    );
  }

  // Diseño normal para el resto de sensores
  return (
    <div className="bg-[#B6B6B6] text-[#0B3B55] rounded-xl p-6 shadow-lg flex flex-col items-center justify-center w-full">
      <div className={`mb-2 ${iconColor}`}>
        {icon}
      </div>
      <p className="text-4xl font-medium mb-1">{label}</p>
      <hr className="border-t border-gray-300 w-2/3 my-2" />
      <h1 className="text-7xl font-semibold text-center">
        {value != null ? `${value} ${unit}` : '...'}
      </h1>
    </div>
  );
}

export default SensorCard;
