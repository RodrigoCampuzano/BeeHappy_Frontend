import React from 'react';
import { useNavigate } from 'react-router-dom';
import HiveSummaryCard from '../components/HiveSummaryCard';
import AlertList from '../components/AlertList';
import { useAuth } from '../../../app/providers/authProvider';
import useHiveData from '../hooks/useHiveData';

const Home = () => {
  const { loading, summary, alertStats, alerts } = useHiveData();
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (loading) return <div className="text-white p-6">Cargando...</div>;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12">
        <main className="flex-1 py-6 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <HiveSummaryCard number={summary.registered} label="Colmenas registradas" />
            <HiveSummaryCard number={summary.active} label="Colmenas activas" />
            <HiveSummaryCard number={alertStats.pending} label="Alertas pendientes" />
            <HiveSummaryCard number={alertStats.completed} label="Alertas completadas" />
          </div>

          <div className="w-full overflow-auto">
            <AlertList alerts={alerts} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
