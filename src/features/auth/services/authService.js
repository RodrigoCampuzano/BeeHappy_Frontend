const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      
    });
   console.log("Enviando datos a /users:", formData);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el login');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};


export const sendVerificationCode = async (email) => {
  const response = await fetch(`${API_BASE_URL}/users/password/reset/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al enviar el código');
  }

  return response.json(); // { message: "Código de verificación enviado" }
};

export const resetPassword = async ({ email, code, new_password }) => {
  console.log("Enviando datos a /users/password/reset:", { email, code, new_password });

  const response = await fetch(`${API_BASE_URL}/users/password/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, code, new_password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Respuesta con error:", errorData);
    throw new Error(errorData.error || 'Error al restablecer la contraseña');
  }

  return response.json();
};
