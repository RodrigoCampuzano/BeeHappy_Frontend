// src/features/auth/hooks/useRegistration.js
import { useState } from 'react';
import { validateRegistrationForm } from '../utils/authValidation';
import { registerUser } from '../services/authService';

const useRegistration = (onSuccess) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    usuario: '',
    correo_electronico: '',
    contrasena: '',
    rol: 'apicultor', 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Protege el campo 'rol' para que no se sobrescriba accidentalmente
    if (name === 'rol') return;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError(null);

    const validationErrors = validateRegistrationForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // Reasegura que se envíe el rol por si algo lo limpió
      const safeData = { ...formData, rol: 'apicultor' };

      const response = await registerUser(safeData);
      console.log('API Response:', response);

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationError(
        error.response?.data?.message || 'Error al registrarte. Intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    registrationError,
  };
};

export default useRegistration;
