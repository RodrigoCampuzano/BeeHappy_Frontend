const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_SENSORES;

export const getHives = async () => {
  const token = sessionStorage.getItem('token'); // Asegúrate de que esté guardado
  const url = `${API_BASE_URL}/colmena/`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener las colmenas');
  }

  const data = await response.json();
  console.log('Colmenas obtenidas:', data);

  // Si necesitas adaptar el formato para HiveCard:
  return data.map(hive => ({
    id: hive.id,
    identificador: hive.identificador,
    area: hive.area_ubicacion,
    type: hive.tipo_colmena,
    estado: hive.estado,
    fechaRegistro: hive.fecha_registro,
    fechaActualizacion: hive.fecha_actualizacion,
    macRaspberry: hive.mac_raspberry,
  }));
};

