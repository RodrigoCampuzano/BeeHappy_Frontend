import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { getColmenaById } from '../services/get_colmena_byID';
import { useDeleteColmena } from '../hooks/useDeleteColmena'; 
import SensorCard from '../components/SensorCard';
import FormCreateColmena from '../components/FormCreateColmena';
import { updateEstadoColmena } from '../services/update_estado';
import TabsNav from '../../../shared/components/TabsNav';
import { useAuth } from '../../../app/providers/authProvider';
import ToastMessage from '../../../shared/components/Modals/ToastMessage'; // <<-- IMPORTACIÓN DIRECTA DE ToastMessage
import ModalConfirmacionEliminarColmena from '../components/modals/ModalConfirmacionEliminarColmena';
import useSensorCalibrations from '../../sensores/hooks/useCalibracionMax';

function HiveDetailDashboard() {
  const { hiveId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [hiveInfo, setHiveInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Desestructuramos todos los estados y funciones del hook useDeleteColmena
  const {
    deleteColmena,
    loading: deleting,
    showToast, // <<-- Estado del toast para eliminación
    toastMessage, // <<-- Mensaje del toast para eliminación
    setShowToast // <<-- Función para controlar el toast de eliminación
  } = useDeleteColmena();

  // <<-- NUEVOS ESTADOS para el ToastMessage en otras situaciones (ej. cambio de estado)
  const [localShowToast, setLocalShowToast] = useState(false);
  const [localToastMessage, setLocalToastMessage] = useState({ type: '', title: '', message: '' });

  const [showEditForm, setShowEditForm] = useState(false);
  const { isTechnician } = useAuth();
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const { calibrations, loading: loadingCalibrations, error: errorCalibrations } = useSensorCalibrations(hiveId);

  const getActiveTab = () => {
    if (location.pathname.includes('/monitoreo-tiempo-real')) return 'monitoreo-tiempo-real';
    if (location.pathname.includes('/estadisticas')) return 'estadisticas';
    if (location.pathname.includes('/alertas')) return 'alertas';
    return 'general';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const fetchHiveInfo = async () => {
    try {
      setLoading(true);
      const hive = await getColmenaById(hiveId);

      setHiveInfo({
        id: hive.id,
        nombre: hive.nombre,
        area_ubicacion: hive.area_ubicacion,
        tipo_colmena: hive.tipo_colmena,
        estado: hive.estado,
        mac_raspberry: hive.mac_raspberry,
        fecha_registro: hive.fecha_registro,
        fecha_actualizacion: hive.fecha_actualizacion,
        identificador: hive.identificador,
        sensores: hive.sensores || {
          temperatura: false,
          humedad: false,
          sonido: false,
          peso: false,
        }
      });

      if (location.pathname === `/colmenas/${hiveId}`) {
        navigate(`/colmenas/${hiveId}/general`, { replace: true });
      }

    } catch (err) {
      console.error("Error al obtener la colmena:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHiveInfo();
  }, [hiveId, navigate, location.pathname]);

  // Manejo del ToastMessage después de la eliminación (del hook useDeleteColmena)
  useEffect(() => {
    if (showToast && toastMessage.type === 'success') {
      const timer = setTimeout(() => {
        navigate('/colmenas');
        setShowToast(false); // Oculta el toast después de la navegación
      }); // Muestra el toast por 1.5 segundos antes de navegar
      return () => clearTimeout(timer);
    }
    // Para errores, el toast se mantendrá visible hasta que el usuario lo cierre con la 'X'
  }, [showToast, toastMessage.type, navigate, setShowToast]);

  // <<-- NUEVO: Manejo del ToastMessage para situaciones locales (ej. cambio de estado)
  useEffect(() => {
    if (localShowToast && localToastMessage.type === 'success') {
        const timer = setTimeout(() => {
            setLocalShowToast(false); // Oculta el toast de éxito automáticamente
        }, 2000); // Toast visible por 2 segundos
        return () => clearTimeout(timer);
    }
    // Para errores locales, el toast se mantendrá visible hasta que el usuario lo cierre.
  }, [localShowToast, localToastMessage.type]);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/colmenas/${hiveId}/${tab}`);
  };

  const getSensorCalibratedValue = (sensorType) => {
    if (loadingCalibrations) return '...';
    if (errorCalibrations) return 'Error';
    return calibrations[sensorType] ? calibrations[sensorType].valor_maximo : 'N/A';
  };

  if (loading) return <div className="text-white text-center text-xl mt-8">Cargando detalles de la colmena...</div>;
  if (error) return <div className="text-red-400 text-center text-xl mt-8">{error}</div>;
  if (!hiveInfo) return <div className="text-white text-center text-xl mt-8">No se encontró información para esta colmena.</div>;

  return (
    <div className='p-4 sm:p-8'>
      <TabsNav activeTab={activeTab} setActiveTab={handleTabClick} />

      <div className="p-4 sm:p-6 bg-[#0C3F72] rounded-lg shadow-xl text-white max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-6">
          <div className="flex-1">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#F7B440]">
              Colmena {hiveInfo.identificador}
            </h2>

            {activeTab === 'general' && (
              <>
                <p className="text-2xl sm:text-3xl mt-2 text-[#F7B440]">
                  Área <span className="font-semibold">{hiveInfo.area_ubicacion}</span>
                </p>
                <p className="text-2xl sm:text-3xl text-[#F7B440]">
                  Tipo: <span className="font-semibold">{hiveInfo.tipo_colmena}</span>
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hiveInfo.estado === 'activo'}
                      onChange={async () => {
                        const nuevoEstado = hiveInfo.estado === 'activo' ? 'inactivo' : 'activo';
                        try {
                          await updateEstadoColmena(hiveId, nuevoEstado);
                          setHiveInfo((prev) => ({ ...prev, estado: nuevoEstado }));
                          // <<-- USAR localToastMessage para este caso
                          setLocalToastMessage({
                            type: 'success',
                            title: 'Estado Actualizado',
                            message: `El estado de la colmena se cambió a "${nuevoEstado.toUpperCase()}".`,
                          });
                          setLocalShowToast(true);
                        } catch (error) {
                          console.error("Error al cambiar el estado:", error);
                          // <<-- USAR localToastMessage para este caso de error
                          setLocalToastMessage({
                            type: 'error',
                            title: 'Error al Actualizar Estado',
                            message: `No se pudo actualizar el estado de la colmena.`,
                          });
                          setLocalShowToast(true);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
                    <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
                  </label>
                  <span className={`text-2xl font-semibold ${hiveInfo.estado === 'activo' ? 'text-green-400' : 'text-red-400'}`}>
                    {hiveInfo.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                  
                </div>
                    
                  <div className="mt-4 text-lg text-white">
                    <p>
                      A continuación se muestran los <span className="text-yellow-400 font-semibold">valores recomendados</span> para cada sensor 
                      que permiten monitorear el estado ideal de la colmena. 
                    </p>
                  </div>
                

              </>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div>
              {!isTechnician && activeTab === 'general' && (
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                  <button
                    onClick={() => {
                      sessionStorage.setItem('id_colmena', hiveId);
                      navigate(`/colmenas/${hiveId}/editar`);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-semibold py-2 px-4 rounded-md flex items-center shadow"
                  >
                    <img src="/edit-05.png" alt="Editar" className="w-5 h-5 mr-2" />
                    Editar colmena
                  </button>

                  <button
                    onClick={() => setMostrarModalEliminar(true)}
                    disabled={deleting}
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-semibold py-2 px-4 rounded-md flex items-center shadow disabled:opacity-50"
                  >
                    <img src="/trash-01.png" alt="Eliminar" className="w-5 h-5 mr-2" />
                    {deleting ? 'Eliminando...' : 'Eliminar colmena'}
                  </button>
                </div>
              )}
            </div>

            {activeTab === 'general' && (
              <div className="w-full mt-14 md:w-[540px]">
          
                <SensorCard
                  label="Peso"
                  value={getSensorCalibratedValue('peso')}
                  unit="kg"
                  iconColor="text-yellow-400"
                  icon={<img src="/peso.png" alt="Peso" className="w-14 h-14" />}
                />
              </div>
            )}
          </div>
        </div>

        <div className="tab-content mt-8">
          {location.pathname.includes('/editar') ? (
            <FormCreateColmena />
          ) : (
            activeTab !== 'general' ? (
              <Outlet />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <SensorCard
                  label="Temperatura"
                  value={getSensorCalibratedValue('temperatura')}
                  unit="°C"
                  iconColor="text-red-400"
                  icon={<img src="/thermometer-03.png" alt="Temperatura" className="w-14 h-14" />}
                />
                <SensorCard
                  label="Humedad"
                  value={getSensorCalibratedValue('humedad')}
                  unit="%"
                  iconColor="text-blue-300"
                  icon={<img src="/droplets-01.png" alt="Humedad" className="w-14 h-14" />}
                />
                <SensorCard
                  label="Frecuencia"
                  value={getSensorCalibratedValue('frecuencia')}
                  unit="MHz"
                  iconColor="text-green-300"
                  icon={<img src="/volume-max.png" alt="Sonido" className="w-14 h-14" />}
                />
              </div>
            )
          )}
        </div>
      </div>
      <ModalConfirmacionEliminarColmena
        visible={mostrarModalEliminar}
        onClose={() => setMostrarModalEliminar(false)}
        onConfirm={async () => {
          await deleteColmena(hiveId); // Llama a la función del hook, que ya gestiona su propio toast.
          setMostrarModalEliminar(false); // Cierra el modal de confirmación.
          // La navegación se gestiona en el `useEffect` del `showToast` que viene del hook `useDeleteColmena`.
        }}
        nombre={`Colmena ${hiveInfo.identificador}`}
        area={hiveInfo.area_ubicacion}
        tipo={hiveInfo.tipo_colmena}
      />
      {/* Toast para la eliminación (viene del useDeleteColmena hook) */}
      {showToast && (
        <ToastMessage
          type={toastMessage.type}
          title={toastMessage.title}
          message={toastMessage.message}
          onClose={() => setShowToast(false)}
        />
      )}
      {/* <<-- NUEVO: Toast para otras situaciones (ej. cambio de estado) */}
      {localShowToast && (
        <ToastMessage
          type={localToastMessage.type}
          title={localToastMessage.title}
          message={localToastMessage.message}
          onClose={() => setLocalShowToast(false)}
        />
      )}
    </div>
  );
}

export default HiveDetailDashboard;
