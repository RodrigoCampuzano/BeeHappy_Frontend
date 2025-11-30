import React from "react";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { useUserProfile } from "../hooks/useUserProfile";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const {
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

  return (
    <div>
      <ChangePasswordForm
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        code={code}
        setCode={setCode}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        loadingChange={loadingChange}
        errorChange={errorChange}
        messageChange={messageChange}
        stepChange={stepChange}
        requestCode={requestCode}
        submitChangePassword={submitChangePassword}
        onClose={() => navigate("/perfil")} // para volver atrás
      />
    </div>
  );
};

export default ChangePasswordPage;
