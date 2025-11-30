import { useState } from 'react';
import { deleteColmenaService } from '../services/delete_colmena';
import { useNavigate } from 'react-router-dom';

export const useDeleteColmena = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false); // Nuevo estado para mostrar el Toast
  const [toastMessage, setToastMessage] = useState({ type: '', title: '', message: '' }); // Nuevo estado para el contenido del Toast
  const navigate = useNavigate();

  const deleteColmena = async (id) => {
    setLoading(true);
    setError(null);
    setShowToast(false); // Ocultar cualquier toast anterior

    try {
      await deleteColmenaService(id);
      setToastMessage({
        type: 'success',
        title: '¡Éxito!',
        message: 'Colmena eliminada exitosamente.',
      });
      setShowToast(true);
      // No redirigir inmediatamente, permite que el Toast se vea por un momento
      // Puedes añadir un setTimeout para redirigir después de unos segundos si lo deseas
      // setTimeout(() => navigate('/colmenas'), 3000); 
    } catch (err) {
      const msg = err.message?.toLowerCase();
      let errorMessage = 'Ocurrió un error inesperado al eliminar la colmena.';
      if (msg && msg.includes("eliminada correctamente")) {
        // Aunque el mensaje diga "eliminada correctamente", si cae en catch,
        // es porque hubo un error de promesa, pero el backend podría haberla borrado.
        // Aquí puedes decidir si mostrar éxito o un error con la nota.
        setToastMessage({
            type: 'success', // A pesar del error en la promesa, si el backend confirma, muestra éxito.
            title: '¡Éxito!',
            message: 'Colmena eliminada exitosamente (posible advertencia del servidor).'
        });
        setShowToast(true);
        // setTimeout(() => navigate('/colmenas'), 3000);
      } else {
        setError(err.message);
        setToastMessage({
          type: 'error',
          title: 'Error',
          message: `Error al eliminar la colmena: ${err.message}`,
        });
        setShowToast(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return { deleteColmena, loading, error, showToast, toastMessage, setShowToast };
};