import React, { useState } from 'react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import useRegistration from '../hooks/useRegistration';
import { Link, useNavigate } from 'react-router-dom';
import ToastMessage from '../../../shared/components/Modals/ToastMessage';
import { useAuth } from '../../../app/providers/authProvider';

function RegistrationForm({ onRegistrationSuccess }) {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    registrationError,
  } = useRegistration(() => {
    handleSuccess();
    onRegistrationSuccess?.();
  });

  const { error } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  function handleSuccess() {
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      navigate('/login');
    }, 3000);
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden font-poppins">
      {/* Imagen de fondo a la izquierda */}
      <div className="hidden md:flex-1 md:block w-full md:w-1/2">
        <img
          src="/login.png"
          alt="Fondo con abejas y hexágonos"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Formulario */}
      <div className="md:flex-1 w-full md:w-1/2 bg-[#0E103F] text-white px-8 sm:px-12 py-10 overflow-y-auto flex flex-col">
        {/* Logo y Título */}
       <div className="flex items-center gap-3 mb-6">
  <img src="/Logo.png" alt="BeeHappy Logo" className="h-12 sm:h-16" />
  <h1 className="font-bold text-3xl sm:text-5xl">BeeHappy</h1>
</div>


        <h2 className="text-3xl font-semibold mb-2">¡Únete a la colmena!</h2>
        <p className="mb-6">Crea tu cuenta para entrar al mundo BeeHappy.</p>

        {/* Mensajes de error */}
        {(error || registrationError) && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded">
            {error || registrationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 flex-grow">
          <Input
            label="Nombre(s):"
            placeholder="Ingresa tu nombre"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            error={errors.nombres}
          />
          {errors.nombres && <p className="text-[#FF6347] text-sm -mt-3">{errors.nombres}</p>}

          <Input
            label="Apellidos:"
            placeholder="Ingresa tus apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            error={errors.apellidos}
          />
          {errors.apellidos && <p className="text-[#FF6347] text-sm -mt-3">{errors.apellidos}</p>}

          <Input
            label="Usuario:"
            placeholder="Máximo 20 caracteres"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            error={errors.usuario}
          />
          {errors.usuario && <p className="text-[#FF6347] text-sm -mt-3">{errors.usuario}</p>}

          <Input
            label="Correo electrónico:"
            placeholder="Ingresa tu correo electrónico"
            name="correo_electronico"
            type="email"
            value={formData.correo_electronico}
            onChange={handleChange}
            error={errors.correo_electronico}
          />
          {errors.correo_electronico && <p className="text-[#FF6347] text-sm -mt-3">{errors.correo_electronico}</p>}

          <Input
            label="Contraseña:"
            placeholder="Mínimo 8 caracteres"
            name="contrasena"
            type="password"
            value={formData.contrasena}
            onChange={handleChange}
            error={errors.contrasena}
          />
          {errors.contrasena && <p className="text-[#FF6347] text-sm -mt-3">{errors.contrasena}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </Button>

          <p className="text-center text-[#B0C4DE] text-sm mt-6">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>

      {showModal && (
  <ToastMessage
    type="success"
    title="¡Registro exitoso!"
    message="Tu cuenta ha sido creada correctamente. Serás redirigido al inicio de sesión."
    onClose={() => {
      setShowModal(false);
      navigate('/login');
    }}
  />
)}


    </div>
  );
}

export default RegistrationForm;
