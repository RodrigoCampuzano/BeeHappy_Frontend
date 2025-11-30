
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/authProvider';
import CodeInput from '../../auth/components/CodeInput';
import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';


export default function LoginForm() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [code2FA, setCode2FA] = useState('');
  const { 
    login, 
    loading, 
    error, 
    requireTwoFactor, 
    verifyTwoFactorCode 
  } = useAuth();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);


  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const [loading2FA, setLoading2FA] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoadingLogin(true);

    try {
      const response = await login({ usuario, contrasena });

      if (!response.require_two_factor) {
        navigate('/dashboard');
      }
    } catch (err) {
      setLocalError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading2FA(true);

    try {
      await verifyTwoFactorCode(code2FA);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Código incorrecto o error en verificación');
    } finally {
      setLoading2FA(false);
    }
  };

  if (requireTwoFactor) {
    return (
      <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden font-poppins">
        <div className="flex flex-col w-full md:w-1/2 bg-[#0E103F]  px-8 sm:px-12 py-10">
          <h2 className="text-3xl font-semibold mb-4 text-white">Verificación en dos pasos</h2>
          <p className="mb-6 text-white">Ingresa el código que te enviamos al correo.</p>

          {localError && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded">
              {localError}
            </div>
          )}

          <form onSubmit={handleVerify2FA} className="flex flex-col space-y-4">
            <CodeInput value={code2FA} onChange={setCode2FA} />

            <button
              type="submit"
              disabled={loading2FA || code2FA.length !== 6}
              className="bg-yellow-400 text-black py-2 px-4 rounded font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
            >
              {loading2FA ? 'Verificando...' : 'Verificar código'}
            </button>
          </form>
        </div>

        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img
            src="/login.png"
            alt="Fondo con abejas y hexágonos"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }


  // Si no requiere 2FA, mostrar el formulario normal de login
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden font-poppins">
      {/* Sección Izquierda */}
      <div className="flex flex-col w-full md:w-1/2 bg-[#0E103F] text-white px-8 sm:px-12 py-10">
        {/* Logo y Título */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/Logo.png" alt="BeeHappy Logo" className="h-16" />
          <h1 className="text-3xl font-bold">BeeHappy</h1>
        </div>

        {/* Bienvenida */}
        <h2 className="text-3xl font-semibold mb-2">¡Bienvenido!</h2>
        <p className="mb-6">Tu colmena te espera, ingresa tus datos.</p>

        {/* Mensaje de error */}
        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded">
            {(error === "Failed to fetch" || localError === "Failed to fetch")
              ? "No se pudo conectar con el servidor. Intenta más tarde."
              : error || localError}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm">Usuario</label>
            <input
              type="text"
              maxLength={20}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu usuario registrado"
              className="w-full px-4 py-2 mt-1 rounded bg-white text-black"
              required
            />
            <p className="text-xs mt-1">Máximo 20 caracteres</p>
          </div>
          <div className="relative">
  <label className="block text-sm">Contraseña</label>
  <input
    type={mostrarContrasena ? 'text' : 'password'}
    minLength={8}
    value={contrasena}
    onChange={(e) => setContrasena(e.target.value)}
    placeholder="Ingresa tu contraseña registrada"
    className="w-full px-4 py-2 mt-1 rounded bg-white text-black pr-10"
    required
  />
  <button
    type="button"
    onClick={() => setMostrarContrasena((prev) => !prev)}
    className="absolute right-3 top-9 text-gray-600"
  >
    {mostrarContrasena ? <HiEye size={20} /> : <HiEyeOff size={20} />}
  </button>
  <p className="text-xs mt-1">Mínimo 8 caracteres</p>
</div>

          <div className="flex justify-end">
            <Link to="/forgot-contrasena" className="text-sm underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loadingLogin}
            className="bg-yellow-400 text-black py-2 px-4 rounded font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loadingLogin ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Enlace a registro */}
        <p className="mt-6 text-sm">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="underline">
            Regístrate
          </Link>
        </p>

        <div className="mt-auto flex items-end">
          <img
            src="/Group1.png"
            alt="Abeja decorativa"
            className="w-24 animate-float"
          />
        </div>
      </div>

      {/* Sección Derecha */}
      <div className="w-full md:w-1/2 h-64 md:h-auto">
        <img
          src="/login.png"
          alt="Fondo con abejas y hexágonos"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
