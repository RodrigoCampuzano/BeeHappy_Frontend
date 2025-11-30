import React, { useState, useEffect } from 'react';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { useTiposSensores } from '../../sensores/hooks/useSensores';
import ModalCalibracion from '../../sensores/components/ModalCalibracion';
import ToastMessage from '../../../shared/components/Modals/ToastMessage';
import { getColmenaSensores } from '../services/get_colmena_sensores';
import { createColmenaSensor } from '../../sensores/services/create_sensores';
import { deleteColmenaSensor } from '../../sensores/services/delete_colmena_sensor';
import { createCalibracion } from '../../sensores/services/calibracion_sensores';
import { updateCalibracion } from '../../sensores/services/update_calibracion';
import { getCalibracionesByColmena } from '../../sensores/services/get_calibracion_sensores';
import { obtenerIdSensorPorNombre } from '../../sensores/services/get_sensor_nombre';

const StepSensoresCalibracion = ({ formState, onFinish,setPaso }) => {
  const { sensores, setSensores, handleSensorChange } = formState;
  const { tiposSensores, loading, error } = useTiposSensores();
  const [showToast, setShowToast] = useState(false);
const [toastType, setToastType] = useState('success'); // 'success' | 'error'
const [toastMessage, setToastMessage] = useState('');


  const [sensoresAsignados, setSensoresAsignados] = useState([]);
  const [sensorCalibrar, setSensorCalibrar] = useState(null);
  const [calibrando, setCalibrando] = useState(false);
  const [calibracionesExistentes, setCalibracionesExistentes] = useState({});
  const colmenaId = sessionStorage.getItem('id_colmena');

  // Función para cargar sensores asignados y retornar lista
  const mostrarToast = (tipo, mensaje) => {
  setToastType(tipo);
  setToastMessage(mensaje);
  setShowToast(true);
  setTimeout(() => setShowToast(false), 4000);
};

  const cargarSensoresAsignados = async () => {
    try {
      const todos = await getColmenaSensores();
      const filtrados = todos.filter(s => s.id_colmena === Number(colmenaId));

      const nuevosSensores = {};
      filtrados.forEach(sensor => {
        nuevosSensores[sensor.nombre_sensor] = true;
      });

      setSensores(nuevosSensores);

      const asignadosMapeados = filtrados.map(s => ({
        id: s.id_sensor,
        nombre: s.nombre_sensor,
        idRelacion: s.id,
      }));

      setSensoresAsignados(asignadosMapeados);

      return asignadosMapeados; // Retorna para usar inmediatamente
    } catch (e) {
      console.error('Error obteniendo sensores asignados:', e);
      return [];
    }
  };

  useEffect(() => {
    if (colmenaId) {
      cargarSensoresAsignados();
    }
  }, [colmenaId]);

  // Carga calibraciones por colmenaId
  useEffect(() => {
    if (colmenaId) {
      getCalibracionesByColmena(colmenaId).then(res => {
        const porSensor = {};
        res.calibraciones.forEach(cal => {
          porSensor[cal.id_sensor] = cal;
        });

        console.log('📦 Calibraciones obtenidas de la API:', res.calibraciones);
        console.log('🔍 Mapeo por id_sensor:', porSensor);

        setCalibracionesExistentes(porSensor);
      }).catch(err => {
        console.error('❌ Error cargando calibraciones:', err);
      });
    } else {
      console.warn('⚠️ colmenaId no está definido');
    }
  }, [colmenaId]);

  const handleGuardarCalibracion = async data => {
    try {
      if (data.id) {
        await updateCalibracion(data.id, data);
        
      } else {
        await createCalibracion(data);
      }
      mostrarToast('success', 'Calibración guardada con éxito');

      setCalibrando(false);
      setSensorCalibrar(null);

      // Recargar calibraciones para actualizar datos mostrados
      if (colmenaId) {
        const res = await getCalibracionesByColmena(colmenaId);
        const porSensor = {};
        res.calibraciones.forEach(cal => {
          porSensor[cal.id_sensor] = cal;
        });
        setCalibracionesExistentes(porSensor);
      }
    } catch (e) {
      console.error('Error guardando calibración:', e);
      mostrarToast('error', 'Error guardando la calibración');

    }
  };

  const handleCheckboxChange = async (e, sensor) => {
    const checked = e.target.checked;

    // Actualiza checkbox local
    handleSensorChange(e);

 if (checked) {
  try {
    console.log('✅ Asociando sensor:', sensor.nombre);

    await createColmenaSensor({
      id_colmena: Number(colmenaId),
      nombre_sensor: sensor.nombre,
      estado: 'activo',
    });

    // Carga lista actualizada y la usa de inmediato
    const sensoresActualizados = await cargarSensoresAsignados();

    const sensorAsignado = sensoresActualizados.find(s => s.nombre === sensor.nombre);
    console.log('🔧 Sensor asignado:', sensorAsignado);

    // Obtén el id_sensor real consultando por nombre
    const idSensorReal = await obtenerIdSensorPorNombre(sensor.nombre);
    console.log('🧪 ID real del sensor obtenido:', idSensorReal);

    setSensorCalibrar({
      id: idSensorReal,  // usa el ID real
      nombre: sensor.nombre,
    });

    setCalibrando(true);
  } catch (err) {
    console.error('❌ Error al asociar sensor a colmena:', err);
   mostrarToast('error', 'Error al asociar el sensor. Revisa si ya está asignado.');

    setSensores(prev => ({ ...prev, [sensor.nombre]: false }));
  }
} else {
      try {
        const sensorAsignado = sensoresAsignados.find(s => s.nombre === sensor.nombre);

        if (!sensorAsignado || !sensorAsignado.idRelacion) {
          console.warn('⚠️ No se encontró relación para eliminar');
          return;
        }

        console.log('🗑 Eliminando relación con ID:', sensorAsignado.idRelacion);

        await deleteColmenaSensor(sensorAsignado.idRelacion);

        await cargarSensoresAsignados();
      } catch (err) {
        console.error('❌ Error al eliminar relación colmena-sensor:', err);
        mostrarToast('error', 'Error al eliminar relación del sensor');

        setSensores(prev => ({ ...prev, [sensor.nombre]: true }));
      }
    }
  };

  if (loading) return <p className="text-white">Cargando tipos de sensores...</p>;
  if (error) return <p className="text-red-500">Error cargando sensores</p>;

  return (
  <div className="flex justify-center p-6">
    <div className="relative p-6 sm:p-8 bg-[#0C3F72] rounded-lg shadow-2xl w-full max-w-6xl">
      <h1 className="text-white text-4xl font-bold mb-2">
        Paso 2: Asociar sensores
      </h1>
      <p className="text-white text-lg mb-8">
        Selecciona los sensores que deseas asociar a esta colmena. Se abrirá una ventana para calibrarlos automáticamente.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {tiposSensores.map(sensor => (
          <Input
            key={sensor.id}
            type="checkbox"
            name={sensor.nombre}
            checked={!!sensores[sensor.nombre]}
            onChange={e => handleCheckboxChange(e, sensor)}
            containerClassName="text-lg"
            label={sensor.nombre.charAt(0).toUpperCase() + sensor.nombre.slice(1)}
            labelClassName="text-white text-lg"
          />
        ))}
      </div>


<div className="mt-6 sm:absolute sm:bottom-4 sm:right-4 flex flex-col sm:flex-row gap-4 sm:justify-end w-full sm:w-auto p-4 sm:p-0">

  {/* ✅ Botón Volver */}
  <Button
    variant="secondary"
    onClick={() => setPaso(1)}
   fullWidth=''
  >
    ← Volver a datos
  </Button>

  {/* ✅ Botón Finalizar */}
  <Button onClick={onFinish} fullWidth='' variant='secondary'>
    Finalizar y guardar
  </Button>
</div>

      {calibrando && sensorCalibrar && (
        <ModalCalibracion
          isOpen={calibrando}
          onClose={() => {
            setCalibrando(false);
            setSensorCalibrar(null);
          }}
          sensor={sensorCalibrar}
          colmenaId={colmenaId}
          calibracionInicial={calibracionesExistentes[sensorCalibrar?.id]}
          onSave={handleGuardarCalibracion}
        />
      )}
    </div>
    {showToast && (
  <ToastMessage
    type={toastType}
    title={toastType === 'success' ? '¡Éxito!' : '¡Error!'}
    message={toastMessage}
    onClose={() => setShowToast(false)}
  />
)}

  </div>
  
);

};


export default StepSensoresCalibracion;
