import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';

export default function AlertaCard({
  numeroColmena,
  nombre_sensor,
  valor_actual,
  mensaje,
  prioridad,
  fecha_generacion,
  estado,
  checked,
  onCheckedChange,
  variant = 'default',
}) {
  const fechaFormateada = format(new Date(fecha_generacion), "dd 'de' MMMM 'del' yyyy – hh:mm aaa", {
    locale: es,
  });

  if (variant === 'compact') {
    return (
      <div className="bg-yellow-400 text-[#062343] rounded-md p-4 shadow-md space-y-2 relative w-full max-w-full break-words">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          {/* Contenedor principal de la información, se ajustará mejor */}
          <div className="flex-1 min-w-0 pr-4"> {/* Añadido pr-4 para espacio entre el texto y el estado */}
            <p className="text-base sm:text-lg font-medium">
              Variable Afectada: <strong className="break-words">{nombre_sensor}</strong>
            </p>
            <p className="text-base sm:text-lg font-medium">
              Valor actual: <strong className="break-words">{valor_actual}</strong>
            </p>
            <p className="text-sm sm:text-base font-medium italic text-yellow-800">
              "<span className="break-words">{mensaje}</span>" {/* Aseguramos break-words en el mensaje */}
            </p>
            <p className="text-sm sm:text-md font-semibold capitalize">
              Prioridad: {prioridad}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-right mt-2">{fechaFormateada}</p> {/* Fecha abajo y a la derecha */}
          </div>
          
          {/* Indicador de estado "Activa" / "Resuelta" */}
          <div className="flex items-center gap-2 bg-[#062343] text-white px-3 py-1 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap self-end sm:self-start">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {checked ? 'Resuelta' : 'Pendiente'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch bg-[#0D3B66] rounded-md shadow-md overflow-hidden text-white w-full max-w-full">
      <div className="bg-[#062343] flex items-center justify-center px-6 py-4 w-full md:w-auto">
        <div className="text-center">
          <span className="text-base sm:text-xl font-semibold block">Colmena</span>
          <span className="text-2xl sm:text-4xl font-bold block">{numeroColmena}</span>
        </div>
      </div>

      <div className="flex-1 p-4 w-full space-y-2 min-w-0 break-words">
        <p className="text-base sm:text-lg font-medium">
          Sensor: <span className="font-bold break-words">{nombre_sensor}</span>
        </p>
        <p className="text-base sm:text-lg font-medium">
          Valor actual: <span className="font-bold break-words">{valor_actual}</span>
        </p>
        <p className="text-base sm:text-lg font-medium">
          Prioridad: <span className="font-bold capitalize">{prioridad}</span>
        </p>
        <p className="text-sm sm:text-base font-medium text-yellow-300 italic">
          "<span className="break-words">{mensaje}</span>"
        </p>

        {/* CONTENEDOR AJUSTADO PARA MÓVILES EN DEFAULT */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-end md:items-center gap-2 mt-4">
          <span className="text-xs sm:text-sm text-yellow-400 font-semibold mt-2 md:mt-0">{fechaFormateada}</span>
          <div className="flex justify-end items-center w-full md:w-auto"> {/* Contenedor para alinear a la derecha en móvil */}
            <label htmlFor={`checkbox-${numeroColmena}`} className="flex items-center cursor-pointer">
              <input
                id={`checkbox-${numeroColmena}`} // Asegura un ID único
                type="checkbox"
                className="form-checkbox w-6 h-6 text-yellow-400 focus:ring-yellow-400 mr-2" // Más grande y con margen
                checked={checked}
                onChange={onCheckedChange}
                aria-label={`Marcar alerta ${estado === 'activa' ? 'resuelta' : 'activa'}`}
              />
              <span className="text-sm font-medium whitespace-nowrap">
  {checked ? 'Resuelta' : 'Marcar como resuelta'}
</span>

            </label>
          </div>
        </div>
      </div>
    </div>
  );
}