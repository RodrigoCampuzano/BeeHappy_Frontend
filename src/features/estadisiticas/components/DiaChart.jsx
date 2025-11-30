import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

function DiaChart({ title, data, strokeColor, yDomain, xAxisDataKey }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const displayLabel = d.fecha_display || "—";

      return (
        <div className="custom-tooltip p-3 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm shadow-md">
          <p className="label font-semibold mb-2">{displayLabel}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.stroke }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-full w-full">
      <h3 className="text-2xl font-bold mb-4 text-white text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="5 5" stroke="#444" />
          <XAxis dataKey={xAxisDataKey} stroke="#ccc">
            <Label value="Fecha" position="insideBottom" offset={-10} fill="#ccc" />
          </XAxis>
          <YAxis stroke="#ccc" domain={yDomain || ["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          
          <Line
            type="monotone"
            dataKey="valor_maximo"
            stroke="#10b981"
            name="Máximo"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="valor_promedio"
            stroke={strokeColor || "#facc15"}
            name="Promedio"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="valor_minimo"
            stroke="#6366f1"
            name="Mínimo"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DiaChart;
