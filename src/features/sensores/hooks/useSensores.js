import { useEffect, useState } from 'react';
import { getSensores } from '../services/get_sensores';

export const useTiposSensores = () => {
  const [tiposSensores, setTiposSensores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const data = await getSensores();

        setTiposSensores(data);
        
      } catch (err) {
        console.error('Error al cargar tipos de sensores:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

  

    fetchTipos();
  }, []);

  return { tiposSensores, loading, error };
};
