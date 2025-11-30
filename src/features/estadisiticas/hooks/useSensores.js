// useSensores.js
import { useState, useEffect } from "react";

const sensoresData = [
  { id: 8, nombre: "temperatura", descripcion: "Sensor de temperatura ambiente", unidad_medida: "°C", tipo_dato: "decimal" },
  { id: 9, nombre: "humedad", descripcion: "Sensor de humedad relativa", unidad_medida: "%", tipo_dato: "decimal" },
  { id: 10, nombre: "piezoelectrico", descripcion: "Sensor de vibración piezoeléctrico", unidad_medida: "V", tipo_dato: "decimal" },
  { id: 11, nombre: "frecuencia", descripcion: "Frecuencia de zumbido de abejas", unidad_medida: "Hz", tipo_dato: "decimal" },
  { id: 12, nombre: "peso", descripcion: "Sensor de peso de la colmena", unidad_medida: "kg", tipo_dato: "decimal" },
];

export function useSensores() {
  const [sensores, setSensores] = useState([]);

  useEffect(() => {
    // Aquí podría ser fetch o datos estáticos
    setSensores(sensoresData);
  }, []);

  // Helper para obtener nombre según id
  const getNombreSensor = (id) => {
    const sensor = sensores.find(s => s.id === Number(id));
    return sensor ? sensor.nombre : `Sensor ID: ${id}`;
  };

  return { sensores, getNombreSensor };
}
