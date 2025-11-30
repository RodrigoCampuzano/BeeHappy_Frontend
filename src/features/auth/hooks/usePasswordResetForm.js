import { useState, useEffect, useCallback } from 'react';
import { sendVerificationCode, resetPassword } from '../services/authService'; // Asegúrate de que la ruta sea correcta

const MAX_ATTEMPTS = 3; // Número máximo de intentos

export default function usePasswordResetForm(navigate, externalEmail, externalCode) {
 const [email, setEmail] = useState(externalEmail || '');
  const [code, setCode] = useState(externalCode || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [canTry, setCanTry] = useState(true);
  const [codeExpired, setCodeExpired] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !codeExpired) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && showCodeInput) {
      setCodeExpired(true);
      setMessage('El código ha expirado. Por favor, reenvía uno nuevo.');
    }
    return () => clearTimeout(timer);
  }, [countdown, showCodeInput, codeExpired]);

  const handleSendCode = useCallback(async () => {
    if (!email) {
      setMessage('Por favor, ingresa tu correo electrónico.');
      return;
    }

    setMessage('Enviando código de verificación...');

    try {
      await sendVerificationCode(email);
      setMessage('Código de verificación enviado a ' + email);
      setShowCodeInput(true);
      setAttempts(0);
      setCanTry(true);
      setCountdown(60);
      setCodeExpired(false);
    } catch (error) {
      setMessage('Error al enviar código' );
    }
  }, [email]);

const handleVerifyCode = useCallback(() => {
  if (attempts >= MAX_ATTEMPTS) {
    setMessage('Número máximo de intentos superado. Reenvía el código.');
    setCanTry(false);
    return;
  }

  if (codeExpired) {
    setMessage('El código expiró. Por favor, reenvía uno nuevo.');
    return;
  }

  if (code.trim().length !== 6) {
    setMessage('El código debe tener 6 dígitos.');
    return;
  }

  setAttempts(prev => prev + 1);

  setMessage('Código verificado correctamente. Puedes restablecer tu contraseña.');
  setShowPasswordInput(true);
  setCountdown(0);
  setCanTry(true);

  // Aquí pasamos email y code con navigate:
  navigate('/set-new-password', { state: { email, code } });
}, [code, attempts, codeExpired, navigate, email]);


const handleResetPassword = useCallback(async () => {
  if (newPassword.length < 8) {
    setMessage('La contraseña debe tener al menos 8 caracteres.');
    return;
  }
  if (newPassword !== confirmPassword) {
    setMessage('Las contraseñas no coinciden.');
    return;
  }

  setMessage('Restableciendo contraseña...');
  try {
    await resetPassword({ email, code, new_password: newPassword });
    setMessage('Contraseña restablecida exitosamente.');
  } catch (error) {
    setMessage(`Error al restablecer la contraseña: ${error?.message || 'Intenta nuevamente.'}`);

  }
}, [email, code, newPassword, confirmPassword]);



  const handleResendCode = useCallback(async () => {
  if (!email) {
    setMessage('Ingresa un correo para reenviar el código.');
    return;
  }

  setMessage('Reenviando código...');
  try {
    await sendVerificationCode(email);

    setCode('');                  // Limpiar input de código
    setAttempts(0);              // Reiniciar intentos
    setCanTry(true);
    setCodeExpired(false);
    setCountdown(60);            // Reiniciar cuenta regresiva
    setMessage('Nuevo código enviado. Por favor, revisa tu correo.');
    setShowCodeInput(false);     // Forzar reinicio del ciclo de expiración
    setTimeout(() => setShowCodeInput(true), 0); // Reforzar reactivación del useEffect

  } catch (error) {
    setMessage('Error al reenviar código');
  }
}, [email]);


  return {
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCodeInput,
    showPasswordInput,
    message,
    countdown,
    attempts,
    canTry,
    handleSendCode,
    handleVerifyCode,
    handleResetPassword,
    handleResendCode,
    codeExpired
  };
}
