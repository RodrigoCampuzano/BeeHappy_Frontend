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

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "BeeHappy";
      workbook.created = new Date();

      const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 },
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
        const nombreSensor = getNombreSensor(sensorId) || `Sensor ${sensorId}`;
        const sheetName = `${nombreSensor}`.substring(0, 31);
        const sheet = workbook.addWorksheet(sheetName);

        // Título del sensor en la primera fila
        sheet.mergeCells('A1:D1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = `Sensor: ${nombreSensor} — Colmena ${colmena?.identificador || hiveId}`;
        titleCell.font = { bold: true, size: 14, color: { argb: 'FF1A3A5C' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 30;

        // Headers en fila 2
        const headers = ["Fecha", "Valor Mínimo", "Valor Promedio", "Valor Máximo"];
        sheet.addRow(headers);
        const headerRow = sheet.getRow(2);
        headerRow.height = 22;
        headerRow.eachCell(cell => {
          cell.style = headerStyle;
        });

        // Datos
        datos.forEach(item => {
          sheet.addRow([
            item.fecha_display || '',
            Number(item.valor_minimo) || 0,
            Number(item.valor_promedio) || 0,
            Number(item.valor_maximo) || 0,
          ]);
        });

        // Ancho de columnas
        sheet.columns.forEach((col, i) => {
          const headerLength = headers[i].length;
          col.width = headerLength < 18 ? 18 : headerLength + 5;
        });

        // Bordes y alineación para todas las celdas
        sheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Saltar título
          row.eachCell(cell => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          });
          if (rowNumber > 2) row.height = 20;
        });

        // Formato numérico para columnas B, C, D
        for (let r = 3; r <= datos.length + 2; r++) {
          ['B', 'C', 'D'].forEach(col => {
            const cell = sheet.getCell(`${col}${r}`);
            cell.numFmt = '#,##0.00';
          });
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const nombreArchivo = `estadisticas_${activeTab}_${colmena?.identificador || hiveId}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      saveAs(blob, nombreArchivo);
    } catch (err) {
      console.error("❌ Error al exportar Excel:", err);
      alert("Ocurrió un error al exportar. Revisa la consola para más detalles.");
    }
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
