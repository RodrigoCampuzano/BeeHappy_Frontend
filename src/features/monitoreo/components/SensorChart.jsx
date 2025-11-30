import React from 'react';
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
} from 'recharts';

function SensorChart({ title, dataKey, data, strokeColor, yDomain }) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-full w-full">
      <h3 className="text-2xl font-bold mb-4 text-white text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#444" />

          <XAxis
            dataKey="hora"
            stroke="#ccc"
            tickFormatter={(tick) => tick?.slice(0, 5)}
          >
            <Label
              value="Hora"
              position="insideBottom"
              offset={-10}
              fill="#ccc"
              style={{ fontSize: 16, fontWeight: 'bold' }}
            />
          </XAxis>

          <YAxis stroke="#ccc" domain={yDomain || ['auto', 'auto']}>
            <Label
              value={title}
              angle={-90}
              position="insideLeft"
              dx={-30}
              fill="#ccc"
              style={{ fontSize: 16, fontWeight: 'bold' }}
            />
          </YAxis>

          <Tooltip
            labelStyle={{ color: '#000' }}
            contentStyle={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor || "#facc15"}
            name={title}
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SensorChart;
