import React, { useEffect, useRef, useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import TabsNavEstadisticas from '../components/TavsNabEstadisticas';
import Graficas from '../components/Graficas';
import { getColmenaById } from '../../colmenas/services/get_colmena_byID';
import { useEstadisticasSensores } from '../hooks/useEstadisticasSensores';
import { useSensores } from '../hooks/useSensores';

export default function EstadisticasDashboard() {
  const { hiveId } = useParams();
  const [activeTab, setActiveTab] = useState('dia');
  const [colmena, setColmena] = useState(null);
  const [loadingColmena, setLoadingColmena] = useState(true);
  const [errorColmena, setErrorColmena] = useState(null);
  const reportRef = useRef();

  const { estadisticas, loading: loadingStats, error: errorStats } = useEstadisticasSensores(activeTab);
  const { getNombreSensor } = useSensores();

  const formattedDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });

  useEffect(() => {
    const fetchColmena = async () => {
      try {
        const data = await getColmenaById(hiveId);
        setColmena(data);
      } catch (err) {
        console.error('Error al obtener la colmena:', err);
        setErrorColmena(err.message);
      } finally {
        setLoadingColmena(false);
      }
    };

    fetchColmena();
  }, [hiveId]);

  // ✅ Exportar Excel estilizado con ExcelJS
  async function exportToExcel() {
    if (!estadisticas || Object.keys(estadisticas).length === 0) {
      alert("No hay estadísticas para exportar");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Tu App";
    workbook.created = new Date();

    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F75B5' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    Object.entries(estadisticas).forEach(([sensorId, datos]) => {
      const nombreSensor = getNombreSensor(sensorId) || sensorId;
      const sheet = workbook.addWorksheet(`Sensor - ${nombreSensor}`.substring(0, 31));

      const headers = ["Fecha", "Valor Mínimo", "Valor Promedio", "Valor Máximo"];
      sheet.addRow(headers);
      const headerRow = sheet.getRow(1);
      headerRow.height = 22;
      headerRow.eachCell(cell => {
        cell.style = headerStyle;
      });

      datos.forEach(item => {
        sheet.addRow([
          item.fecha_display,
          item.valor_minimo,
          item.valor_promedio,
          item.valor_maximo,
        ]);
      });

      sheet.columns.forEach((col, i) => {
        const headerLength = headers[i].length;
        col.width = headerLength < 15 ? 15 : headerLength + 5;
      });

      sheet.eachRow((row, rowNumber) => {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        if (rowNumber > 1) row.height = 20;
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `estadisticas_${activeTab}.xlsx`);
  }

  if (loadingColmena) {
    return <div className="text-white text-center text-xl mt-8">Cargando información de la colmena...</div>;
  }

  if (errorColmena) {
    return <div className="text-red-500 text-center text-xl mt-8">❌ {errorColmena}</div>;
  }

  return (
    <div className="p-6">
      <TabsNavEstadisticas activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        ref={reportRef}
        className="bg-[#062343] text-white rounded-lg p-6 shadow-lg max-w-6xl mx-auto mt-4"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-yellow-400">
            Colmena {colmena?.identificador || hiveId}
          </h2>

          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full sm:w-auto"
            onClick={exportToExcel}
            disabled={loadingStats || errorStats}
          >
            📝 Exportar Excel
          </button>
        </div>

        <Graficas
          activeTab={activeTab}
          estadisticas={estadisticas}
          loading={loadingStats}
          error={errorStats}
        />
      </div>
    </div>
  );
}
