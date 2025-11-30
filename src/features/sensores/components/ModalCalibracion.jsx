import React, { useState, useEffect } from 'react';
import Button from '../../../shared/components/Button';
import { validarDatosCalibracion } from '../utils/validacionesCalibracion';
import ToastMessage from '../../../shared/components/Modals/ToastMessage';


function ModalCalibracion({ isOpen, onClose, sensor, colmenaId, calibracionInicial, onSave }) {
  const [factor, setFactor] = useState('');
  const [offset, setOffset] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [fecha, setFecha] = useState('');
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState({ type: '', title: '', message: '' });

const handleCloseToast = () => {
  setShowToast(false);
  setToastMessage({ type: '', title: '', message: '' });
};

 useEffect(() => {
  if (isOpen) {
    console.log('🪟 Modal abierto para sensor:', sensor);
    console.log('📐 calibracionInicial recibida:', calibracionInicial);

    const formatToLocalDatetime = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat('es-MX', { // Use a specific locale if preferred
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23', // Ensure 24-hour format
      });
      const parts = formatter.formatToParts(date);
      const year = parts.find(p => p.type === 'year').value;
      const month = parts.find(p => p.type === 'month').value;
      const day = parts.find(p => p.type === 'day').value;
      const hour = parts.find(p => p.type === 'hour').value;
      const minute = parts.find(p => p.type === 'minute').value;

      return `${year}-${month}-${day}T${hour}:${minute}`;
    };

    if (calibracionInicial) {
      setFactor(calibracionInicial.factor_calibracion || '');
      setOffset(calibracionInicial.offset_calibracion || '');
      setValorMax(calibracionInicial.valor_maximo || '');
      setValorMin(calibracionInicial.valor_minimo || '');
      setFecha(calibracionInicial.fecha_calibracion ? formatToLocalDatetime(calibracionInicial.fecha_calibracion) : formatToLocalDatetime(new Date()));
    } else {
      setFactor('');
      setOffset('');
      setValorMax('');
      setValorMin('');
      setFecha(formatToLocalDatetime(new Date()));
    }
  }
}, [isOpen, calibracionInicial, sensor]);
  if (!isOpen) return null;

const handleSubmit = () => {
  const errores = validarDatosCalibracion({ factor, offset, valorMax, valorMin, fecha });

  if (errores.length > 0) {
    setToastMessage({
      type: 'error',
      title: 'Error de validación',
      message: errores[0], // o errores.join('\n') para todos
    });
    setShowToast(true);
    return;
  }

  const macRaw = sessionStorage.getItem('mac') || '';
  const macRaspberry = macRaw.replace(/(^")|("$)/g, '');

  const calibracion = {
    factor_calibracion: parseFloat(factor),
    offset_calibracion: parseFloat(offset),
    valor_maximo: parseFloat(valorMax),
    valor_minimo: parseFloat(valorMin),
    fecha_calibracion: new Date(fecha).toISOString(),
    id_colmena: Number(colmenaId),
    id_sensor: sensor.id,
    mac_raspberry: macRaspberry,
    ...(calibracionInicial?.id ? { id: calibracionInicial.id } : {}),
  };

  onSave(calibracion);
};
useEffect(() => {
  if (showToast) {
    const timer = setTimeout(() => {
      setShowToast(false);
      setToastMessage({ type: '', title: '', message: '' });
    }, 2500);

    return () => clearTimeout(timer);
  }
}, [showToast]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-md w-96 max-h-[90vh] overflow-auto"  >
        <h3 className="text-xl font-semibold mb-4">Calibrar Sensor: {sensor?.nombre}</h3>

        

        <div className="space-y-3">
          <div>
            <label className="block font-medium">Factor calibración</label>
            <input
              type="number"
              step="any"
              value={factor}
              onChange={e => setFactor(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Ajuste calibración</label>
            <input
              type="number"
              step="any"
              value={offset}
              onChange={e => setOffset(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Valor máximo</label>
            <input
              type="number"
              step="any"
              value={valorMax}
              onChange={e => setValorMax(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Valor mínimo</label>
            <input
              type="number"
              step="any"
              value={valorMin}
              onChange={e => setValorMin(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Fecha de calibración</label>
            <input
              type="datetime-local"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={onClose} className="bg-gray-400 hover:bg-gray-500">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Guardar
          </Button>
        </div>
      </div>
      {showToast && (
  <ToastMessage
    type={toastMessage.type}
    title={toastMessage.title}
    message={toastMessage.message}
    onClose={handleCloseToast}
  />
)}

    </div>
  );
}

export default ModalCalibracion;
