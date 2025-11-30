// sensores/hooks/useSensorCalibrations.js
import { useEffect, useState } from 'react';
import { getCalibracionesByColmena } from '../services/get_calibracion_sensores';

/**
 * Hook personalizado para obtener las calibraciones de los sensores de una colmena específica.
 * @param {string} idColmena El ID de la colmena.
 * @returns {{calibrations: object, loading: boolean, error: string | null}}
 * - calibrations: Un objeto donde las claves son los tipos de sensor (ej. 'peso', 'temperatura')
 * y los valores son el objeto de calibración más reciente para ese tipo.
 * - loading: Booleano que indica si la carga de datos está en progreso.
 * - error: Mensaje de error si ocurre alguno, de lo contrario null.
 */
const useSensorCalibrations = (idColmena) => {
  const [calibrations, setCalibrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idColmena) {
      setCalibrations({});
      setLoading(false);
      return;
    }

    const fetchCalibrations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCalibracionesByColmena(idColmena);

        const newCalibrations = {};
        if (data && data.calibraciones && data.calibraciones.length > 0) {
          // Asume un mapeo de id_sensor a tipo de sensor.
          // Necesitarás definir cómo mapeas id_sensor (ej. 8, 9) a 'temperatura', 'humedad', etc.
          // Por ejemplo, podrías tener una tabla de mapeo o que la API lo devuelva.
          // Para este ejemplo, haré una suposición simple, pero deberías ajustarla a tu lógica real.

          // Supongamos un mapeo simple:
          // id_sensor 8 -> Temperatura
          // id_sensor 9 -> Humedad
          // id_sensor X -> Sonido
          // id_sensor Y -> Peso
          // **ATENCIÓN:** DEBES AJUSTAR ESTE MAPEO SEGÚN TUS IDS DE SENSORES REALES Y LA LÓGICA DE TU BACKEND.
          const sensorTypeMap = {
            // Ejemplo de mapeo, ajústalo a tus IDs de sensor reales
            1: 'temperatura', // Asumiendo que 8 es el ID para el sensor de temperatura
            2: 'humedad',    // Asumiendo que 9 es el ID para el sensor de humedad
            3: 'piezoelectrico',
            3: 'frecuencia',
            5: 'peso'
            // Agrega más según tus sensores
            // Por ejemplo:
            // 10: 'sonido',
            // 11: 'peso',
          };

          // Agrupar las calibraciones por tipo de sensor y quedarnos con la más reciente si hay varias
          data.calibraciones.forEach(cal => {
            const sensorType = sensorTypeMap[cal.id_sensor];
            if (sensorType) {
              // Si ya existe una calibración para este tipo de sensor,
              // compara las fechas para tomar la más reciente (o la que consideres "actual")
              if (!newCalibrations[sensorType] || new Date(cal.fecha_calibracion) > new Date(newCalibrations[sensorType].fecha_calibracion)) {
                newCalibrations[sensorType] = cal;
              }
            }
          });
        }
        setCalibrations(newCalibrations);
      } catch (err) {
        console.error("Error fetching calibrations:", err);
        setError(err.message || 'Error al cargar calibraciones');
      } finally {
        setLoading(false);
      }
    };

    fetchCalibrations();
  }, [idColmena]);

  return { calibrations, loading, error };
};

export default useSensorCalibrations;
