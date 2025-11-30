import { useEffect, useState } from 'react';
import { getHivesSummary } from '../services/hiveService';
import { getAlertasByUsuario } from '../../alertas/services/get_alertas_by_usuario';

const useHiveData = () => {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    registered: 0,
    active: 0,
    pending: 0,     // colmenas en estado "pending"
    completed: 0,   // colmenas en estado "completed"
  });

  const [alertStats, setAlertStats] = useState({
    pending: 0,     // alertas pendientes/activas
    completed: 0,   // alertas resueltas/completadas
  });

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hiveSummary = await getHivesSummary();

        const alertasResponse = await getAlertasByUsuario();
        const alertas = Array.isArray(alertasResponse) ? alertasResponse : [];

        const pendingCount = alertas.filter(a =>
          a.estado === 'pendiente' || a.estado === 'activa'
        ).length;

        const completedCount = alertas.filter(a =>
          a.estado === 'completada' || a.estado === 'resuelta'
        ).length;

        const ultimas3 = alertas
          .sort((a, b) => new Date(b.fecha_generacion) - new Date(a.fecha_generacion))
          .slice(0, 3)
          .map(a => {
            const fecha = new Date(a.fecha_generacion);
            return {
              date: fecha.toLocaleDateString(),
              time: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              hive: a.mac_raspberry || 'MAC desconocida',
              message: a.mensaje || 'Mensaje no disponible',
            };
          });

        setSummary(hiveSummary); // ✔️ colmenas
        setAlertStats({ pending: pendingCount, completed: completedCount }); // ✔️ alertas
        setAlerts(ultimas3);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setAlerts([]);
        setAlertStats({ pending: 0, completed: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, summary, alertStats, alerts };
};

export default useHiveData;
