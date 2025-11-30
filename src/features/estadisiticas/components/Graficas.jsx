import React from "react";
import DiaChart from "./DiaChart";
import { useSensores } from "../hooks/useSensores";

function Graficas({ activeTab, estadisticas, loading, error }) {
  const { getNombreSensor } = useSensores();

  const tituloMap = {
    dia: "Diarias",
    semana: "Semanales",
    mes: "Mensuales",
    ano: "Anuales",
  };

  const xAxisKeyMap = {
    dia: "fecha_display",
    semana: "fecha_display",
    mes: "fecha_display",
    ano: "fecha_display",
  };

  if (loading)
    return <div className="text-white text-center text-xl mt-8">Cargando estadísticas...</div>;
  if (error)
    return <div className="text-red-400 text-center text-xl mt-8">{error}</div>;
  if (!Object.keys(estadisticas).length)
    return <div className="text-white text-center text-xl mt-8">No hay datos disponibles.</div>;

  return (
    <div className="p-6 bg-blue-800 bg-opacity-70 rounded-lg shadow-xl text-white max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Estadísticas {tituloMap[activeTab]}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {Object.entries(estadisticas).map(([sensorId, datos]) => (
          <DiaChart
            key={sensorId}
            title={`Sensor: ${getNombreSensor(sensorId)}`}
            data={datos}
            strokeColor="#facc15"
            yDomain={calcularYDomain(datos)}
            xAxisDataKey={xAxisKeyMap[activeTab]}
          />
        ))}
      </div>

      <p className="text-sm text-gray-300 text-right mt-4">
        Última actualización: {getUltimaFecha(estadisticas)}
      </p>
    </div>
  );
}

function calcularYDomain(datos) {
  const valoresMin = datos.map(d => Number(d.valor_minimo)).filter(v => !isNaN(v));
  const valoresMax = datos.map(d => Number(d.valor_maximo)).filter(v => !isNaN(v));

  if (!valoresMin.length || !valoresMax.length) return [0, 1];

  const min = Math.min(...valoresMin);
  const max = Math.max(...valoresMax);

  const diferencia = max - min;

  // Si solo hay un dato, o min y max son iguales o casi iguales
  if (datos.length === 1 || diferencia < 1e-2) {
    const margen = 1; // puedes ajustar este margen fijo si lo ves necesario
    return [min - margen, max + margen];
  }

  // Rango normal con margen relativo
  return [min - diferencia * 0.1, max + diferencia * 0.1];
}


function getUltimaFecha(estadisticas) {
  let ultimaFecha = null;
  Object.values(estadisticas).forEach((arr) => {
    if (arr.length > 0) {
      const fechaMasReciente = arr.reduce((max, d) => {
        const currentFecha = new Date(d.fecha_fin || d.fecha_inicio || d.timestamp);
        return currentFecha > max ? currentFecha : max;
      }, new Date(0));
      if (!ultimaFecha || fechaMasReciente > ultimaFecha) {
        ultimaFecha = fechaMasReciente;
      }
    }
  });
  return ultimaFecha ? ultimaFecha.toLocaleDateString("es-ES") : "N/A";
}

export default Graficas;
