
import RegistrationForm from '../components/RegisterForm';

function RegisterPage  ()  {
  const handleRegistrationSuccess = (formData) => {
    console.log('Registration successful:', formData);
    // TODO: Navigate to dashboard or show success message
    // e.g., history.push('/dashboard'); or display a toast notification
  };

  return (
    
        <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />


  );
};

export default RegisterPage;