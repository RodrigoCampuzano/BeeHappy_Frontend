import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../features/authentication/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loadingInit, setLoadingInit] = useState(true);

  // Nuevo estado para 2FA
  const [requireTwoFactor, setRequireTwoFactor] = useState(false);
  const [emailFor2FA, setEmailFor2FA] = useState(null);

  useEffect(() => {
    const current = authService.getCurrentUsuario();
    setUsuario(current);
    setLoadingInit(false);
  }, []);

  // Login que puede devolver si requiere 2FA
  const login = async (credentials) => {
    const response = await authService.login(credentials);

    if (response.require_two_factor) {
      setRequireTwoFactor(true);
      setEmailFor2FA(response.email); // Guarda email para verificación 2FA
      setUsuario(null); // No autenticado aún
    } else {
      setUsuario(credentials.usuario);
      setRequireTwoFactor(false);
      setEmailFor2FA(null);
    }

    return response;
  };

  // Nuevo método para verificar 2FA
  const verifyTwoFactorCode = async (code) => {
    if (!emailFor2FA) throw new Error('No hay email para verificar');

    const userObject = await authService.verify2FA({ code, email: emailFor2FA });

    setUsuario(userObject.usuario);
    setRequireTwoFactor(false);
    setEmailFor2FA(null);

    return userObject;
  };

  const logout = async () => {
    await authService.logout();
    setUsuario(null);
    setRequireTwoFactor(false);
    setEmailFor2FA(null);
  };

  const isAuthenticated = Boolean(usuario);
const isTechnician = usuario?.rol === 'tecnico';

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated,
        login,
        logout,
        requireTwoFactor,
        verifyTwoFactorCode,
        emailFor2FA,
         isTechnician,
      }}
    >
      {!loadingInit && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
