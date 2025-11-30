import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col text-[#FFC424] items-center justify-center bg-yellow-100 p-8" style={{ backgroundImage: 'url("/panel-blue.png")' }}>
      <h1 className="text-[180px] font-bold  mb-4">404</h1>
      <p className="text-4xl font-bold  mb-6">Página no encontrada</p>
      <Link to="/" className=" underline hover:text-blue-800">
        Volver al inicio
      </Link>
    </div>
  );
}
