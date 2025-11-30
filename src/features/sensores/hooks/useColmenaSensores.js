import { useState, useEffect } from 'react';
import { getColmenaSensores } from '../services/get_colmena_sensores'; // Usar esta función, no getColmenaSensoresByColmena si no existe
import { createColmenaSensor } from '../../sensores/services/create_sensores';
import { deleteColmenaSensor } from '../../sensores/services/delete_colmena_sensor';
import { getCalibracionesByColmena } from '../../sensores/services/get_calibracion_sensores';

export const useColmenaSensores = (colmenaId, sensores, setSensores) => {
  const [sensoresAsignados, setSensoresAsignados] = useState([]);
  const [calibraciones, setCalibraciones] = useState({});
  const [sensorCalibrar, setSensorCalibrar] = useState(null);
  const [calibrando, setCalibrando] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargarSensoresAsignados = async () => {
    try {
      const todos = await getColmenaSensores();
      const filtrados = todos.filter(s => s.id_colmena === Number(colmenaId));

      // Mapea para setSensores en formState
      const nuevosSensores = {};
      filtrados.forEach(sensor => {
        nuevosSensores[sensor.nombre_sensor] = true;
      });
      setSensores(nuevosSensores);

      const asignados = filtrados.map(s => ({
        id: s.id_sensor,
        nombre: s.nombre_sensor,
        idRelacion: s.id,
      }));

      setSensoresAsignados(asignados);
      return asignados;
    } catch (e) {
      console.error('❌ Error cargando sensores asignados:', e);
      return [];
    }
  };

  const cargarCalibraciones = async () => {
    try {
      const res = await getCalibracionesByColmena(colmenaId);
      const porSensor = {};
      (res?.calibraciones || []).forEach(cal => {
        porSensor[cal.id_sensor] = cal;
      });
      setCalibraciones(porSensor);
    } catch (e) {
      console.error('❌ Error cargando calibraciones:', e);
    }
  };

  useEffect(() => {
    if (colmenaId) {
      Promise.all([cargarSensoresAsignados(), cargarCalibraciones()]).finally(() => setLoading(false));
    }
  }, [colmenaId]);

  const asociarSensor = async (sensor) => {
    try {
      // **Asegúrate que el payload que envías aquí cumple la API**
      const creado = await createColmenaSensor({
        id_colmena: Number(colmenaId),
        nombre_sensor: sensor.nombre,
        estado: 'activo',
      });

      const sensorAsignado = {
        id: creado.id_sensor,
        nombre: creado.nombre_sensor,
        idRelacion: creado.id,
      };

      // Actualiza lista asignados localmente
      setSensoresAsignados(prev => [...prev, sensorAsignado]);

      // Actualiza el estado global de checkboxes
      setSensores(prev => ({ ...prev, [sensor.nombre]: true }));

      setSensorCalibrar(sensorAsignado);
      setCalibrando(true);
    } catch (err) {
      console.error('❌ Error asociando sensor:', err);
      throw new Error('Error al asociar sensor');
    }
  };

  const desasociarSensor = async (sensor) => {
    try {
      const encontrado = sensoresAsignados.find(s => s.id === sensor.id);
      if (!encontrado?.idRelacion) return;

      await deleteColmenaSensor(encontrado.idRelacion);

      setSensoresAsignados(prev => prev.filter(s => s.idRelacion !== encontrado.idRelacion));

      // Actualiza el estado global de checkboxes
      setSensores(prev => ({ ...prev, [sensor.nombre]: false }));
    } catch (err) {
      console.error('❌ Error desasociando sensor:', err);
      throw err;
    }
  };

  const cerrarModal = () => {
    setCalibrando(false);
    setSensorCalibrar(null);
  };

  const actualizarCalibraciones = async () => {
    await cargarCalibraciones();
  };

  return {
    sensoresAsignados,
    calibraciones,
    calibrando,
    sensorCalibrar,
    asociarSensor,
    desasociarSensor,
    cerrarModal,
    actualizarCalibraciones,
    loading,
    setSensorCalibrar,
    setCalibrando,
  };
};
