// src/shared/layouts/AuthLayout.jsx
import React from 'react';
// Importa tus imágenes si las manejas con Webpack/Vite para obtener rutas optimizadas
// import BeeIcon from '../../../assets/bee-icon.png';
// import HexagonPattern from '../../../assets/hexagon-pattern.svg';

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-r from-[#FFD700] to-[#1A2B4C]
                    md:flex-row flex-col"> {/* Responsive column on small screens */}
      {/* Yellow Side */}
      <div className="relative flex-1 flex justify-center items-center md:min-h-screen min-h-[30vh]">
        {/* Hexagon Pattern - Requires a background image or a more complex SVG overlay */}
        {/* For simplicity, let's assume a background image for now */}
        <div
          className="absolute inset-0 opacity-10 bg-cover"
          style={{ backgroundImage: `url('/assets/hexagon-pattern.svg')` }}
        ></div>

        {/* Bees */}
        {/* Make sure your bee images are in your public/assets folder or imported correctly */}
        <img
          src="/assets/bee-icon.png" // Adjust path
          alt="Bee"
          className="absolute top-5 left-5 w-20 animate-[fly-bee_10s_infinite_linear]"
        />
        <img
          src="/assets/bee-icon.png" // Adjust path
          alt="Bee"
          className="absolute bottom-10 left-1/4 w-16 animate-[fly-bee_8s_infinite_linear_reverse]"
        />
      </div>

      {/* Dark Blue Side */}
      <div className="flex-1 flex justify-center items-center p-5 bg-[#1A2B4C] md:min-h-screen min-h-[70vh]">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;