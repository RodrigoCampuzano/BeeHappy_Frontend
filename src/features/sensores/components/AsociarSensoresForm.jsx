import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTiposSensores } from '../hooks/useSensores';
import { createColmenaSensor } from '../services/create_sensores';
import { createCalibracion } from '../services/calibracion_sensores';
import ModalCalibracion from './ModalCalibracion';

const AsociarSensoresForm = () => {
  // ✅ Paso 1: Obtener hiveId de URL o sessionStorage
  const { hiveId: hiveIdFromParams } = useParams();
  const hiveId = Number(hiveIdFromParams || sessionStorage.getItem('id_colmena'));

  const { tiposSensores, loading } = useTiposSensores();
  const [sensorSeleccionado, setSensorSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!hiveId) {
      alert('ID de colmena no disponible');
    }
  }, [hiveId]);

  const handleAsociar = async (sensor) => {
    try {
      await createColmenaSensor({
        id_colmena: hiveId,
        nombre_sensor: sensor.nombre,
        estado: 'activo',
      });

      alert(`Sensor ${sensor.nombre} asociado correctamente`);

      // 🧼 Limpieza opcional: elimina el id_colmena del sessionStorage
      sessionStorage.removeItem('id_colmena');
    } catch (err) {
      alert('Error al asociar sensor');
      console.error(err);
    }
  };

  const handleAbrirCalibracion = (sensor) => {
    setSensorSeleccionado(sensor);
    setModalOpen(true);
  };

  const handleGuardarCalibracion = async (calibracionData) => {
    try {
      await createCalibracion(calibracionData);
      alert('Calibración guardada');
      setModalOpen(false);
    } catch (err) {
      alert('Error al guardar calibración');
      console.error(err);
    }
  };

  if (loading) return <p>Cargando sensores...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Asociar Sensores a Colmena #{hiveId}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiposSensores.map((sensor) => (
          <div key={sensor.id} className="bg-[#0C3F72] p-4 rounded shadow text-white">
            <h3 className="text-xl font-semibold">{sensor.nombre}</h3>
            <div className="mt-2 flex gap-2">
              <button
                className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
                onClick={() => handleAsociar(sensor)}
              >
                Asociar
              </button>
              <button
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                onClick={() => handleAbrirCalibracion(sensor)}
              >
                Calibrar
              </button>
            </div>
          </div>
        ))}
      </div>

      <ModalCalibracion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sensor={sensorSeleccionado}
        colmenaId={hiveId}
        onSave={handleGuardarCalibracion}
      />
    </div>
  );
};

export default AsociarSensoresForm;
