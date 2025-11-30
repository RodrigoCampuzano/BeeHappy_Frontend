import React from 'react';

const AlertList = ({ alerts }) => (
  <div className="bg-[#0C3F72] text-white p-4 rounded-lg shadow-lg w-full">
    <h3 className="text-lg sm:text-xl mb-4 font-bold">Últimas alertas</h3>
    {alerts.map((alert, idx) => (
      <div key={idx} className="mb-2 text-sm sm:text-base">
        <span>{alert.date} {alert.time}</span> – 
        <span className="font-semibold ml-2">{alert.hive}</span>: 
        <span className="text-yellow-400 ml-1">{alert.message}</span>
      </div>
    ))}
  </div>
);


export default AlertList;
