// src/hooks/useCountdown.js
import { useState, useEffect, useRef, useCallback } from 'react';

function useCountdown(initialSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const startCountdown = useCallback(() => {
    if (!isRunning && secondsLeft > 0) {
      setIsRunning(true);
    }
  }, [isRunning, secondsLeft]);

  const resetCountdown = useCallback((newInitialSeconds = initialSeconds) => {
    setSecondsLeft(newInitialSeconds);
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, secondsLeft]);

  return { secondsLeft, startCountdown, resetCountdown, isRunning };
}

export default useCountdown;