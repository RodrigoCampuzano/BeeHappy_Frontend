import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import EmailInput from '../components/EmailInput';
import CodeInput from '../components/CodeInput';
import CountdownTimer from '../components/CountdownTimer';
import usePasswordResetForm from '../hooks/usePasswordResetForm';
import validateEmail from '../utils/validateEmail';
import Button from '../../../shared/components/Button';

export default function ValidateCodeVerification() {
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    code,
    setCode,
    showCodeInput,
    showPasswordInput,
    message,
    countdown,
    attempts,
    canTry,
    handleSendCode,
    handleVerifyCode,
    handleResendCode,
    codeExpired
  } = usePasswordResetForm(navigate);

  return (
    <div className="relative min-h-screen bg-[#FFD400] flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-12 bg-cover bg-center overflow-auto"
      style={{ backgroundImage: 'url("/panel.png")' }}
    >
      {/* Fondo de opacidad */}
      <div className="absolute inset-0 bg-cover bg-center opacity-15 z-0" style={{ backgroundImage: 'url("/panel.png")' }}></div>

      {/* Botón de volver */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 left-4 sm:top-10 sm:left-10 text-gray-700 hover:text-gray-900 transition-colors z-50 p-2 rounded-full bg-[#013A55] bg-opacity-80 hover:bg-opacity-100 shadow-md"
        aria-label="Volver"
      >
        <FiArrowLeft size={40} className='text-[#FFD400]' />
      </button>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-3xl pt-24 sm:pt-0 p-6 sm:p-10 md:p-12 z-10">

        <h2 className="text-[#013A55] text-2xl sm:text-3xl md:text-4xl font-poppins font-bold text-start mb-6 sm:mb-10">
          Ingresa tu correo electrónico:
        </h2>

        <div className="flex flex-col items-center space-y-6">
          <EmailInput value={email} onChange={setEmail} disabled={showCodeInput} />

          {!showCodeInput && (
            <Button
              onClick={handleSendCode}
              disabled={!email || !validateEmail(email)}
              variant="primary"
              className="w-full"
            >
              Enviar código de verificación
            </Button>
          )}

          {showCodeInput && (
            <>
              {!showPasswordInput && (
                <p className="text-base sm:text-lg text-gray-800 text-center">
                  Introduce el código de 6 dígitos enviado a tu correo:
                </p>
              )}

              {!showPasswordInput && (
                <>
                  <CodeInput value={code} onChange={setCode} />

                  <Button
                    onClick={handleVerifyCode}
                    disabled={code.length !== 6 || !canTry}
                    variant="primary"
                    className="w-full"
                  >
                    Verificar código de verificación
                  </Button>

                  <CountdownTimer
                    seconds={countdown}
                    onResend={handleResendCode}
                  />

                 

                 
                </>
              )}
            </>
          )}

          {message && (
            <p
              className={`text-base sm:text-lg text-center font-medium ${
                message.toLowerCase().includes('error') ||
                message.toLowerCase().includes('inválido') ||
                message.toLowerCase().includes('fallida') ||
                message.toLowerCase().includes('expiró') ||
                message.toLowerCase().includes('superado')
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
