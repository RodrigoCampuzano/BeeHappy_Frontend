import React, { useRef, useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../../../shared/components/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import usePasswordResetForm from '../hooks/usePasswordResetForm';
import ToastMessage from '../../../shared/components/Modals/ToastMessage';

export default function ResetPasswordSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};

  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    message,
    handleResetPassword,
  } = usePasswordResetForm(navigate, email, code);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    if (message) {
      const msgLower = message.toLowerCase();
      if (msgLower.includes('exitosamente')) {
        setToastType('success');
        setShowToast(true);
        const timer = setTimeout(() => {
          setShowToast(false);
          navigate('/login');
        }, 4000);
        return () => clearTimeout(timer);
      } else if (
        msgLower.includes('error') ||
        msgLower.includes('falló') ||
        msgLower.includes('inválido') ||
        msgLower.includes('expiró') ||
        msgLower.includes('coinciden')
      ) {
        setToastType('error');
        setShowToast(true);
        const timer = setTimeout(() => setShowToast(false), 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [message, navigate]);

  return (
    <>
      {showToast && (
        <ToastMessage
          type={toastType}
          title={toastType === 'success' ? '¡Contraseña actualizada!' : '¡Atención!'}
          message={message}
          onClose={() => {
            setShowToast(false);
            if (toastType === 'success') navigate('/login');
          }}
        />
      )}

    <div
  className="min-h-screen flex items-center justify-center px-4 sm:px-8 py-10 sm:py-16 bg-cover bg-center relative"
  style={{ backgroundImage: 'url("/panel-blue.png")' }}
>
  <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl text-center  p-9 sm:p-8 ">
    <h2 className="text-white text-2xl sm:text-3xl font-bold font-poppins mb-4">
      Restablecer contraseña
    </h2>
    <p className="text-white text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 px-2 sm:px-0">
      Por favor, crea una nueva contraseña y confírmala
    </p>

    <div className="w-full flex flex-col items-center space-y-6">
      <FormInput
        label="Contraseña nueva:"
        value={newPassword}
        onChange={setNewPassword}
        type="password"
        placeholder="Mínimo 8 caracteres"
        showPasswordToggle={true}
      />

      <FormInput
        label="Confirmar contraseña:"
        value={confirmPassword}
        onChange={setConfirmPassword}
        type="password"
        placeholder="Ingresa tu nueva contraseña"
        showPasswordToggle={true}
      />

      <div className="flex flex-col w-full items-center gap-4 mt-4">
        <Button
          onClick={handleResetPassword}
          variant="secondary"
          className="bg-[#F7B801] text-black hover:bg-[#e6a800] font-bold text-lg py-4 w-full sm:w-96 rounded-xl shadow-md"
        >
          Cambiar contraseña
        </Button>

        <Button
          onClick={() => navigate('/login')}
          variant="secondary"
          className="bg-white text-[#1A2B4C] hover:bg-gray-100 border w-full sm:w-96 font-bold text-lg py-4 rounded-xl shadow-md"
        >
          Cancelar
        </Button>
      </div>
    </div>
  </div>
</div>

    </>
  );
}
