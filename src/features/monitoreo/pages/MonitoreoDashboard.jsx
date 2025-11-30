import MonitoreoGraf from '../components/Monitoreo_Graf';
import { getColmenaById } from '../../colmenas/services/get_colmena_byID';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getHivesForMonitoring } from '../services/hiveService';

export default function MonitoreoDashboard() {
    const { hiveId } = useParams();
    const [colmena, setColmena] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchColmena = async () => {
        try {
            setLoading(true);
            const colmenaData = await getColmenaById(hiveId);
            setColmena(colmenaData);
        } catch (err) {
            console.error('❌ Error al cargar colmena:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };
    
        fetchColmena();
    }, [hiveId]);
    
    return (
        <div className="relative p-6">
        {loading ? (
            <p>Cargando...</p>
        ) : error ? (
            <p>Error: {error}</p>
        ) : (
            <>
            <h1 className="text-2xl font-bold mb-4">Monitoreo de Colmena: {colmena?.identificador || hiveId}</h1>
            <MonitoreoGraf />
            </>
        )}
        </div>
    );
    }