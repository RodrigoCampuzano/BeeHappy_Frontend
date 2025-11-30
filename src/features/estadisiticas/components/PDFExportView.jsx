// components/PDFExportView.jsx
import React from 'react';
import DiaChart from './DiaChart';

const PDFExportView = ({ colmenaId, activeTab, estadisticas, formattedDate, getNombreSensor }) => {
  return (
    <div style={{
      backgroundColor: '#062343',
      color: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '1200px',
      margin: '16px auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <h2 style={{
          color: '#facc15',
          fontSize: '28px',
          fontWeight: 'bold',
          margin: 0
        }}>
          Colmena {colmenaId}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#d1d5db',
          margin: 0
        }}>
          {formattedDate}
        </p>
      </div>

      <div style={{
        backgroundColor: 'rgba(30, 58, 138, 0.7)',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          Estadísticas {getTitulo(activeTab)}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          {Object.entries(estadisticas).map(([sensorId, datos]) => (
            <div key={sensorId} style={{
              backgroundColor: 'rgb(29, 78, 216)',
              padding: '16px',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white'
              }}>
                Sensor: {getNombreSensor(sensorId)}
              </h3>
              <DiaChart 
                title={''}
                data={datos}
                strokeColor="#facc15"
                yDomain={calcularYDomain(datos)}
                xAxisDataKey="fecha_display"
                pdfMode={true}
              />
            </div>
          ))}
        </div>

        <p style={{
          fontSize: '12px',
          color: '#d1d5db',
          textAlign: 'right',
          marginTop: '16px'
        }}>
          Última actualización: {getUltimaFecha(estadisticas)}
        </p>
      </div>
    </div>
  );
};

function getTitulo(activeTab) {
  const tituloMap = {
    dia: "Diarias",
    semana: "Semanales",
    mes: "Mensuales",
    ano: "Anuales",
  };
  return tituloMap[activeTab];
}

function calcularYDomain(datos) {
  const valoresMin = datos.map((d) => d.valor_minimo);
  const valoresMax = datos.map((d) => d.valor_maximo);
  const min = Math.min(...valoresMin);
  const max = Math.max(...valoresMax);
  return [min * 0.9, max * 1.1];
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

export default PDFExportView;