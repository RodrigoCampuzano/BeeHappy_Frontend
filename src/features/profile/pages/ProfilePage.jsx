import React, { useState } from "react";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import UserProfile from "../components/UserProfile";
import { toggleTwoFactorApi } from "../services/verificacion_dos_pasos";

const ProfilePage = () => {
  const {
    profile,
    loadingProfile,
    errorProfile,
    currentPassword,
    setCurrentPassword,
    code,
    setCode,
    newPassword,
    setNewPassword,
    loadingChange,
    errorChange,
    messageChange,
    stepChange,
    setStepChange,
    requestCode,
    submitChangePassword,
  } = useUserProfile();

  const navigate = useNavigate();
  if (loadingProfile) return <p>Cargando perfil...</p>;
  if (errorProfile) return <p className="text-red-600">{errorProfile}</p>;

  return (
    <div>
      <UserProfile
        profile={profile}
        onChangePasswordClick={() => navigate("/change-password")}
        toggleTwoFactorService={toggleTwoFactorApi}
      />

     
    </div>
  );
};

export default ProfilePage;
