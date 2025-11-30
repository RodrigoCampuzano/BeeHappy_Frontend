import { useState, useEffect } from 'react';

// Utilidad para recuperar valores desde sessionStorage
const getStoredValue = (key, defaultValue) => {
  const stored = sessionStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

export const useColmenaForm = () => {
  const [colmenaId, setColmenaId] = useState(() => getStoredValue('colmenaId', ''));
  const [nombreColmena, setNombreColmena] = useState(() => getStoredValue('nombreColmena', ''));
  const [areaUbicacion, setAreaUbicacion] = useState(() => getStoredValue('areaUbicacion', ''));
  const [tipoColmena, setTipoColmena] = useState(() => getStoredValue('tipoColmena', ''));
  const [mac, setMac] = useState(() => getStoredValue('mac', ''));
  const [sensores, setSensores] = useState(() =>
    getStoredValue('sensores', {
      temperatura: false,
      humedad: false,
      sonido: false,
      peso: false,
    })
  );
  const [modoEdicion, setModoEdicion] = useState(() => {
  return !!sessionStorage.getItem('id_colmena');
});


  // Guardar cada cambio en sessionStorage
  useEffect(() => sessionStorage.setItem('colmenaId', JSON.stringify(colmenaId)), [colmenaId]);
  useEffect(() => sessionStorage.setItem('nombreColmena', JSON.stringify(nombreColmena)), [nombreColmena]);
  useEffect(() => sessionStorage.setItem('areaUbicacion', JSON.stringify(areaUbicacion)), [areaUbicacion]);
  useEffect(() => sessionStorage.setItem('tipoColmena', JSON.stringify(tipoColmena)), [tipoColmena]);
  useEffect(() => sessionStorage.setItem('mac', JSON.stringify(mac)), [mac]);
  useEffect(() => sessionStorage.setItem('sensores', JSON.stringify(sensores)), [sensores]);

  const handleSensorChange = (e) => {
    const updated = {
      ...sensores,
      [e.target.name]: e.target.checked,
    };
    setSensores(updated);
  };

  const resetForm = () => {
    setColmenaId('');
    setNombreColmena('');
    setAreaUbicacion('');
    setTipoColmena('');
    setMac('');
    setSensores({
      temperatura: false,
      humedad: false,
      sonido: false,
      peso: false,
    });

    // Limpieza de sessionStorage
    sessionStorage.removeItem('colmenaId');
    sessionStorage.removeItem('nombreColmena');
    sessionStorage.removeItem('areaUbicacion');
    sessionStorage.removeItem('tipoColmena');
    sessionStorage.removeItem('mac');
    sessionStorage.removeItem('sensores');
    sessionStorage.removeItem('id_colmena');
  };

 return {
  colmenaId,
  setColmenaId,
  nombreColmena,
  setNombreColmena,
  areaUbicacion,
  setAreaUbicacion,
  tipoColmena,
  setTipoColmena,
  mac,
  setMac,
  sensores,
  setSensores,
  handleSensorChange,
  resetForm,
  modoEdicion,
  setModoEdicion, // <--- nuevo
};

};
