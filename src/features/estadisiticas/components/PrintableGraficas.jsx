import React from "react";
import { useSensores } from "../hooks/useSensores";
import { useEstadisticasSensores } from "../hooks/useEstadisticasSensores";

function PrintableGraficas({ colmena, hiveId, activeTab, formattedDate }) {
  const { getNombreSensor } = useSensores();
  const { estadisticas } = useEstadisticasSensores(activeTab);

  const tituloMap = {
    dia: "Diarias",
    semana: "Semanales",
    mes: "Mensuales",
    ano: "Anuales",
  };

  if (!estadisticas || !Object.keys(estadisticas).length) {
    return <div>No hay datos disponibles.</div>;
  }

  return (
    <div
      style={{
        backgroundColor: '#062343',
        color: 'white',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ color: '#facc15', fontSize: '28px', fontWeight: 'bold' }}>
          Colmena {colmena?.identificador || hiveId}
        </h2>
        <p style={{ fontSize: '14px', color: '#d1d5db' }}>{formattedDate}</p>
      </div>

      <h3
        style={{
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        Estadísticas {tituloMap[activeTab]}
      </h3>

      {Object.entries(estadisticas).map(([sensorId, datos], idx) => (
        <div
          key={sensorId}
          style={{
            marginBottom: '32px',
            padding: '16px',
            backgroundColor: '#1e3a8a',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ color: '#facc15', fontSize: '18px', marginBottom: '12px' }}>
            Sensor: {getNombreSensor(sensorId)}
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #fff' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Fecha</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Mínimo</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Promedio</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Máximo</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '8px' }}>{item.fecha_display}</td>
                  <td style={{ padding: '8px' }}>{item.valor_minimo}</td>
                  <td style={{ padding: '8px' }}>{item.valor_promedio}</td>
                  <td style={{ padding: '8px' }}>{item.valor_maximo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default PrintableGraficas;
