import React from 'react';

const HiveCard = ({ hive, onClick }) => {
  return (
    <div
      className="flex flex-col lg:flex-row w-full rounded-lg shadow-lg cursor-pointer overflow-hidden transition-transform hover:scale-[1.01] bg-white"
      onClick={() => onClick(hive.id)}
    >
      {/* Sección Izquierda: ID */}
      <div className="flex items-center justify-center bg-[#0B1D31] text-white p-4 lg:w-1/4 min-h-[100px]">
        <div className="text-4xl sm:text-5xl font-bold">{hive.id}</div>
      </div>

      {/* Sección Derecha: Info */}
      <div className="flex flex-col justify-center bg-yellow-500 text-blue-950 p-4 lg:p-6 w-full">
        <h3 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">Colmena {hive.id}</h3>
        <p className="text-sm sm:text-base mb-1">Área: {hive.area_ubicacion}</p>
        <p className="text-sm sm:text-base mb-2">Tipo: {hive.tipo_colmena}</p>
        <p className="text-xs sm:text-sm">Humedad, Peso, Sonido, Temperatura, Piezoelectrico</p>
      </div>
    </div>
  );
};

export default HiveCard;
