// src/hooks/useVerificationCode.js
import { useState } from 'react';
import useCountdown from './useCountdown';

export default function useVerificationCode(startSeconds = 300) {
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [codeExpired, setCodeExpired] = useState(false);

  const [countdown, startCountdown] = useCountdown(startSeconds, () => {
    setMessage('El código ha expirado, puedes solicitar uno nuevo.');
    setCodeExpired(true);
  });

  const reset = () => {
    setAttempts(0);
    setMessage('');
    setCodeExpired(false);
    startCountdown();
  };

  const addAttempt = () => {
    setAttempts((prev) => {
      const newAttempts = prev + 1;
      if (newAttempts >= 3) {
        setMessage('Has alcanzado el máximo de intentos, solicita un nuevo código');
      }
      return newAttempts;
    });
  };

  const canTry = attempts < 3 && !codeExpired && countdown > 0;

  return {
    countdown,
    startCountdown,
    attempts,
    message,
    setMessage,
    addAttempt,
    canTry,
    reset,
    codeExpired,
  };
}
