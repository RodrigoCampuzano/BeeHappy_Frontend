// src/features/authentication/components/TwoFactorVerificationForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../app/providers/authProvider';

export default function TwoFactorVerificationForm({ email, onVerified }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const { verify2FA } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verify2FA({ code, email });
      onVerified();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Verificación en dos pasos</h2>
      <p className="mb-4 text-center">Ingresa el código enviado a <strong>{email}</strong></p>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="Código de verificación"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Verificar
        </button>
      </form>
    </div>
  );
}
