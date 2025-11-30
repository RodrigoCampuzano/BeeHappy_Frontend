import React, { useEffect, useState } from 'react';
import AlertaCard from '../components/AlertaCard';
import TabsAlertas from '../components/TabsAlertas';
import ToastMessage from '../../../shared/components/Modals/ToastMessage';
import { getAlertasByUsuario } from '../services/get_alertas_by_usuario';
import { updateAlertaEstado } from '../services/update_alertas';
import { getColmenaByUsuario } from '../../colmenas/services/get_colmena_byUsuario';
import { useLocation } from 'react-router-dom';

export default function UserAlertsDashboard() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pendientes');
  const location = useLocation();

  const variant = location.pathname.includes('/colmenas') ? 'compact' : 'default';
  const [toastVisible, setToastVisible] = useState(false);
  const [toastData, setToastData] = useState({ type: 'success', title: '', message: '' });

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const [alertas, colmenas] = await Promise.all([
        getAlertasByUsuario(),
        getColmenaByUsuario(),
      ]);

      const transformadas = alertas.map((alerta) => {
        const colmena = colmenas.find(
          (c) => c.mac_raspberry === alerta.mac_raspberry
        );

        return {
          ...alerta,
          checked: alerta.estado !== 'activa',
          numeroColmena: colmena?.identificador || 'Sin ID',
        };
      });

      setAlertas(transformadas);
    } catch (err) {
      console.error('Error al obtener alertas/colmenas:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCheck = async (id) => {
    const alerta = alertas.find((a) => a.id === id);
    if (!alerta) return;

    const nuevoEstado = alerta.estado === 'activa' ? 'resuelta' : 'activa';

    try {
      await updateAlertaEstado(id, nuevoEstado);

      const nuevasAlertas = alertas.map((a) =>
        a.id === id ? { ...a, estado: nuevoEstado, checked: nuevoEstado !== 'activa' } : a
      );

      setAlertas(nuevasAlertas);

      setToastData({
        type: nuevoEstado === 'resuelta' ? 'success' : 'warning',
        title: nuevoEstado === 'resuelta' ? 'Alerta Resuelta' : 'Alerta Activada',
        message:
          nuevoEstado === 'resuelta'
            ? 'La alerta ha sido marcada como resuelta correctamente.'
            : 'La alerta ha sido reactivada.',
      });

      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 4000);
    } catch (error) {
      setToastData({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar el estado de la alerta: ' + error.message,
      });
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 4000);
    }
  };

  const alertasFiltradas = alertas.filter((alerta) =>
    activeTab === 'pendientes' ? alerta.estado === 'activa' : alerta.estado !== 'activa'
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Alertas del Usuario</h2>

      <TabsAlertas activeTab={activeTab} setActiveTab={handleTabChange} />

      {loading ? (
        <p className="text-white">Cargando alertas...</p>
      ) : error ? (
        <p className="text-red-500">❌ {'No hay Alertas '}</p>
      ) : alertasFiltradas.length === 0 ? (
        <p className="text-white">
          No hay alertas {activeTab === 'pendientes' ? 'activas' : 'resueltas'}.
        </p>
      ) : (
        <div className="space-y-4 px-4">
          {alertasFiltradas.map((alerta) => (
            <AlertaCard
              key={alerta.id}
              numeroColmena={alerta.numeroColmena}
              nombre_sensor={alerta.nombre_sensor}
              valor_actual={alerta.valor_actual}
              mensaje={alerta.mensaje}
              prioridad={alerta.prioridad}
              fecha_generacion={alerta.fecha_generacion}
              estado={alerta.estado}
              checked={alerta.checked}
              onCheckedChange={() => handleCheck(alerta.id)}
              variant={variant}
            />
          ))}
        </div>
      )}

      {toastVisible && (
        <ToastMessage
          type={toastData.type}
          title={toastData.title}
          message={toastData.message}
          onClose={() => setToastVisible(false)}
        />
      )}
    </div>
  );
}
