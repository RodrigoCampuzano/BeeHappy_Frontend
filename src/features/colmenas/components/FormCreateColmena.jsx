import React, { useState, useEffect } from 'react';
import StepDatosColmena from './StepDatosColmena';
import StepSensoresCalibracion from './StepSensoresCalibracion';
import { useColmenaForm } from '../hooks/useColmenaForm';
import Button from '../../../shared/components/Button';
import ToastMessage from '../../../shared/components/Modals/ToastMessage';
import { useNavigate } from 'react-router-dom';
import { Import } from 'lucide-react';

const FormCreateColmena = () => {
  const [paso, setPaso] = useState(() => {
    const storedPaso = sessionStorage.getItem('paso');
    return storedPaso ? Number(storedPaso) : 1;
  });
const {
  colmenaId,
  setColmenaId,
  nombreColmena,
  setNombreColmena,
  areaUbicacion,
  setAreaUbicacion,
  tipoColmena,
  setTipoColmena,
  sensores,
  setSensores,
  handleSensorChange,
  resetForm,
  // 👇 AÑADE ESTAS DOS LÍNEAS
  modoEdicion,
  setModoEdicion,
} = useColmenaForm();
const hiveId = sessionStorage.getItem('id_colmena');
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
const [toastType, setToastType] = useState('success');
const [toastMessage, setToastMessage] = useState('');

const mostrarToast = (tipo, mensaje) => {
  setToastType(tipo);
  setToastMessage(mensaje);
  setShowToast(true);
  setTimeout(() => setShowToast(false), 4000);
};

    

  // Persistir paso actual
  useEffect(() => {
    sessionStorage.setItem('paso', paso);
  }, [paso]);

  const formState = {
  colmenaId,
  setColmenaId,
  nombreColmena,
  setNombreColmena,
  areaUbicacion,
  setAreaUbicacion,
  tipoColmena,
  setTipoColmena,
  sensores,
  setSensores,
  handleSensorChange,
  modoEdicion,
};


  const handleColmenaCreada = () => {
    setPaso(2);
  };

const handleFinalizar = () => {
  mostrarToast('success', 'Colmena y sensores guardados correctamente');

  setTimeout(() => {
    resetForm();
    sessionStorage.removeItem('paso');
    setPaso(1);

    const destino = modoEdicion && colmenaId
      ? '/colmenas'
      : `/colmenas/${hiveId}/general`;

    setModoEdicion(false);
    navigate(destino);
  }, 1000); // Mostrar toast antes de redirigir
};


  return (
    <div className="max-w-5xl mx-auto p-6">
      {modoEdicion && (
  <div className="text-yellow-300 text-sm mt-2 font-medium">
    Estás editando una colmena existente.
  </div>
)}

      {/* Barra de pasos */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center text-white justify-between gap-4 sm:gap-0">
        <div className="flex-1 justify-center flex items-center pb-6">
          <div className={`w-8 h-8 rounded-full flex mx-3 items-center justify-center ${paso >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
            1
          </div>
          <div className="ml-2 text-sm font-medium whitespace-nowrap">Datos Colmena</div>
        </div>

        <div className="flex-1 h-1 bg-gray-300 mx-2">
          <div className={`h-1 ${paso > 1 ? 'bg-blue-600 w-full' : 'bg-blue-200 w-0'}`}></div>
        </div>

        <div className="flex-1 flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
          <div className="ml-2 text-sm font-medium">Sensores y calibración</div>
        </div>
      </div>

      {/* Contenido dinámico por paso */}
      {paso === 1 ? (
        <StepDatosColmena formState={formState} onColmenaCreada={handleColmenaCreada} />
      ) : (
        <>
          <StepSensoresCalibracion formState={formState} onFinish={handleFinalizar} setPaso={setPaso}  />
          
        </>
      )}
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

export default FormCreateColmena;
