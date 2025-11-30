// src/features/auth/utils/authValidation.js
export const validateRegistrationForm = (data) => {
  const errors = {};

  if (!data.nombres.trim()) {
    errors.name = 'El nombre es obligatorio.';
  }

  if (!data.apellidos.trim()) {
    errors.lastName = 'El apellido es obligatorio.';
  }

  if (!data.usuario.trim()) {
    errors.usuario = 'El usuario es obligatorio.';
  } else if (data.usuario.length > 20) {
    errors.usuario = 'El usuario no debe exceder los 20 caracteres.';
  }

  if (!data.correo_electronico.trim()) {
    errors.correo_electronico = 'El correo electrónico es obligatorio.';
  } else if (!/\S+@\S+\.\S+/.test(data.correo_electronico)) {
    errors.correo_electronico = 'El correo electrónico no es válido.';
  }

  if (!data.contrasena.trim()) {
    errors.contrasena = 'La contraseña es obligatoria.';
  } else if (data.contrasena.length < 8) {
    errors.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
  }

  return errors;
};