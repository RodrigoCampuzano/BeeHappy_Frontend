import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';
import LoginForm from '../../features/authentication/components/LoginForm';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import ValidateCodeVerification from '../../features/auth/pages/ValidateCodeVerification';
import NotFoundPage from '../../shared/pages/NotFoundPage';

import Home from '../../features/dashboard/pages/Home';
import Colmenas from '../../features/colmenas/pages/Colmenas';
import Estadisticas from '../../features/estadisiticas/pages/Estadisticas';
import Monitoreo from '../../features/monitoreo/pages/Monitoreo';
import Alertas from '../../features/alertas/pages/Alertas';
import ProfilePage from '../../features/profile/pages/ProfilePage';
import ChangePasswordPage from '../../features/profile/pages/ChangePasswordPage';
import Graficas from '../../features/estadisiticas/components/Graficas';

import MainLayout from '../../shared/layouts/MainLayout';
import HiveDetailDashboard from '../../features/colmenas/pages/HiveDetailsDashboard';
import FormCreateColmena from '../../features/colmenas/components/FormCreateColmena';
import ResetPasswordSection from '../../features/auth/pages/ResetPasswordSection';
import EstadisticasDashboard from '../../features/estadisiticas/pages/EstadisticasDashboard';
import AlertsDashboard from '../../features/alertas/pages/AlertasDashboard';
import MonitoreoGraf from '../../features/monitoreo/components/Monitoreo_Graf';
import AsociarSensoresForm from '../../features/sensores/components/AsociarSensoresForm';
import UserAlertsDashboard from '../../features/alertas/pages/UserAlertsDashboard';

export default function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/Inicio" replace /> : <LoginForm />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/Inicio" replace /> : <LoginForm />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/Inicio" replace /> : <RegisterPage />} />
        <Route path="/forgot-contrasena" element={isAuthenticated ? <Navigate to="/Inicio" replace /> : <ValidateCodeVerification />} />
        <Route path="/set-new-password" element={<ResetPasswordSection />} />

        {/* Rutas protegidas */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/" replace />}>
          <Route path="/Inicio" element={<Home />} />
          <Route path="/colmenas" element={<Colmenas />} />

          {/* Rutas generales */}
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/alertas" element={<UserAlertsDashboard />} />

          {/* Monitoreo - lista */}
          <Route path="/monitoreo" element={<Monitoreo />} />

          {/* Crear colmena */}
          <Route path="formulario-colmena" element={<FormCreateColmena isEdit={false} />} />
          <Route path="/perfil" element={<ProfilePage/>} />
          <Route path="change-password" element={<ChangePasswordPage />} />

          {/* Detalle colmena con rutas anidadas */}
          <Route path="/colmenas/:hiveId" element={<HiveDetailDashboard />}>
            <Route index element={null} /> {/* render por defecto o manejar en HiveDetailDashboard */}
            <Route path="general" element={null} /> {/* Vista general */}
            <Route path="estadisticas" element={<EstadisticasDashboard />} />
            <Route path="monitoreo-tiempo-real" element={<MonitoreoGraf />} />
            <Route path="alertas" element={<AlertsDashboard />} />
          </Route>

          {/* Monitoreo en tiempo real desde /monitoreo */}
   
          <Route path="/estadisticas/colmena/:hiveId" element={<EstadisticasDashboard />} />
          <Route path="/alertas/colmena/:hiveId" element={<AlertsDashboard />} />
          <Route path="/monitoreo/colmena/:hiveId/" element={<MonitoreoGraf/>} />
          {/* Rutas de administración */}
          <Route path="/colmenas/:hiveId/editar" element={<FormCreateColmena isEdit={true} />} />

<Route path="/colmenas/:hiveId/asociar-sensores" element={<AsociarSensoresForm />} />


        </Route>

        {/* Ruta catch-all */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}
