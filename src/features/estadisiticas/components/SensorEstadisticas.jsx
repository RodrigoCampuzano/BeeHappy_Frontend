import React, { useState } from 'react';
import SensorChart from './SensorChart';

function SensorEstadisticas({ data, sensors }) {
  const [showAvg, setShowAvg] = useState(true);
  const [showMin, setShowMin] = useState(true);
  const [showMax, setShowMax] = useState(true);

  const colorMap = {
    temperature: "#f59e0b",
    humidity: "#3b82f6",
    weight: "#10b981",
    frecuencia: "#9333ea",
    vibracion: "#ef4444",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center bg-slate-800 p-4 rounded-xl shadow-inner mb-6">
        <span className="text-white font-semibold">Mostrar:</span>
        <label className="text-white">
          <input type="checkbox" checked={showAvg} onChange={() => setShowAvg(!showAvg)} className="mr-2" />
          Promedio
        </label>
        <label className="text-white">
          <input type="checkbox" checked={showMin} onChange={() => setShowMin(!showMin)} className="mr-2" />
          Mínimo
        </label>
        <label className="text-white">
          <input type="checkbox" checked={showMax} onChange={() => setShowMax(!showMax)} className="mr-2" />
          Máximo
        </label>
      </div>

      {sensors.map(sensor => (
        <SensorChart
          key={sensor}
          title={`Sensor: ${sensor}`}
          data={data}
          dataKey={sensor}
          strokeColor={colorMap[sensor] ?? "#38bdf8"}
          show={{ avg: showAvg, min: showMin, max: showMax }}
        />
      ))}
    </div>
  );
}

export default SensorEstadisticas;
