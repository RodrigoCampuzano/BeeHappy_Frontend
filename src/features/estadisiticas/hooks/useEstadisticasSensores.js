import { useEffect, useState } from "react";
import { getEstadisticasDia } from "../services/get_estadisticas_dia";
import { getEstadisticasSemana } from "../services/get_estadisticas_semana";
import { getEstadisticasMes } from "../services/get_estadisticas_mes";
import { getEstadisticasAno } from "../services/get_estadisticas_anio";

export function useEstadisticasSensores(activeTab) {
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      setLoading(true);
      setError(null);

      try {
        let data = [];

        if (activeTab === "dia") {
          data = await getEstadisticasDia();
          setEstadisticas(agruparPorSensorYFechaDia(data));
        } else if (activeTab === "semana") {
          data = await getEstadisticasSemana();
          setEstadisticas(agruparPorSensorYFecha(data, "semana"));
        } else if (activeTab === "mes") {
          data = await getEstadisticasMes();
          setEstadisticas(agruparPorSensorYFecha(data, "mes"));
        } else if (activeTab === "ano") {
          data = await getEstadisticasAno();
          setEstadisticas(agruparPorSensorYFecha(data, "ano"));
        } else {
          throw new Error("Tab inválido");
        }
      } catch (err) {
        console.error("❌ Error al obtener estadísticas:", err.message);
        setError("No se pudieron cargar las estadísticas.");
        setEstadisticas({});
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, [activeTab]);

  return { estadisticas, loading, error };
}

function agruparPorSensorYFechaDia(data) {
  const agrupado = {};
  data.forEach(({ id_sensor, fecha, valor_minimo, valor_promedio, valor_maximo }) => {
    if (!agrupado[id_sensor]) agrupado[id_sensor] = [];

    const date = new Date(fecha);

    agrupado[id_sensor].push({
      timestamp: date.getTime(),
      fecha_display: date.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
      valor_minimo,
      valor_promedio,
      valor_maximo,
    });
  });

  Object.values(agrupado).forEach((arr) => {
    arr.sort((a, b) => a.timestamp - b.timestamp);
  });

  return agrupado;
}

function agruparPorSensorYFecha(data, tab) {
  const agrupado = {};

  data.forEach(({ id_sensor, fecha_inicio, fecha_fin, valor_minimo, valor_promedio, valor_maximo, ...rest }) => {
    if (!agrupado[id_sensor]) agrupado[id_sensor] = [];

    const fechaInicio = new Date(fecha_inicio);

    agrupado[id_sensor].push({
      ...rest,
      timestamp: fechaInicio.getTime(),
      fecha_inicio,
      fecha_fin,
      fecha_display: formatearFechaSegunTab({ fecha_inicio, fecha_fin, ano_semana: rest.ano_semana }, tab),
      valor_minimo,
      valor_promedio,
      valor_maximo,
    });
  });

  Object.values(agrupado).forEach((arr) => {
    arr.sort((a, b) => a.timestamp - b.timestamp);
  });

  return agrupado;
}

function formatearFechaSegunTab(data, tab) {
  switch (tab) {
    case "semana": {
      const start = new Date(data.fecha_inicio);
      const end = new Date(data.fecha_fin);
      const options = { day: "numeric", month: "short" };
      return `${start.toLocaleDateString("es-ES", options)} - ${end.toLocaleDateString("es-ES", options)}`;
    }
    case "mes":
      return new Date(data.fecha_inicio).toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      });
    case "ano":
      return new Date(data.fecha_inicio).getFullYear().toString();
    default:
      return new Date(data).toLocaleDateString("es-ES");
  }
}
