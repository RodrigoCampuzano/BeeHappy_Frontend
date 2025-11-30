import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

const MainLayout = () => {
  const location = useLocation();
  let title = 'COLMENAS';
  let showBackButton = false;

  if (location.pathname.startsWith('/dashboard')) {
    title = 'INICIO';
  }

  if (
    location.pathname.startsWith('/colmenas/') ||
    location.pathname === '/formulario-colmena'
  ) {
    showBackButton = true;
    title = '';
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-poppins">
      <Sidebar />
      
      <div className="flex-1 flex flex-col bg-blue-950"
        style={{ backgroundImage: 'url("/panel-blue.png")', backgroundSize: 'cover' }}
      >
        <Header title={title} showBack={showBackButton} />

        {/* Área principal con scroll en móvil si es necesario */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
