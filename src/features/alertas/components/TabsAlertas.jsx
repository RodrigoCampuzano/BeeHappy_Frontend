import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon } from '@heroicons/react/24/solid';


const TabsAlertas = ({ activeTab, setActiveTab }) => {
  const alertasTabs = [
  { key: 'pendientes', label: 'Pendientes', icon: <ExclamationTriangleIcon className="w-5 h-5 "/> },
  { key: 'resueltas', label: 'Resueltas', icon: <CheckCircleIcon className="w-5 h-5 " /> },
];


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // No navega, solo cambia estado
  };

  return (
    <div className="px-4 py-2 mb-8">
      {/* Dropdown solo en móviles */}
      <div className="block sm:hidden mb-4">
        <select
          value={activeTab}
          onChange={(e) => handleTabClick(e.target.value)}
          className="w-full p-2 bg-[#B6B6B6] border rounded-md text-sm"
        >
          {alertasTabs.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Botones visibles desde sm: hacia arriba */}
      <div className="hidden sm:flex flex-wrap gap-2 bg-[#B6B6B6] p-2 border rounded-xl">
        {alertasTabs.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200
              ${
                activeTab === key
                  ? 'bg-[#194569] text-white border-[#194569]'
                  : 'text-black border-gray-300 hover:border-blue-600 hover:text-blue-800'
              }`}
            onClick={() => handleTabClick(key)}
          >
            {icon}
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsAlertas;
