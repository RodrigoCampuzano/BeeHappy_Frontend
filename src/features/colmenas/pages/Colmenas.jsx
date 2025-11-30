import { FaPlus } from 'react-icons/fa';
import ColmenasResumen from '../components/ColmenasResumen';

function Colmenas() {
  return (
    <div className="relative px-4 sm:px-6 md:px-8 py-6">
      {/* Contenedor del botón en flex para adaptarlo mejor en tablets y móviles */}
      <div className="flex justify-end mb-4 sm:mb-6">
        <button
          onClick={() => window.location.href = '/formulario-colmena'}
          className="flex items-center gap-2 bg-[#FBB03B] text-[#1C2A39] font-bold px-3 py-2 rounded-lg shadow hover:brightness-110 transition-all"
        >
          <div className="border-2 border-[#1C2A39] rounded-md p-1 flex items-center justify-center">
            <FaPlus className="text-xs sm:text-sm text-[#1C2A39]" />
          </div>
          <span className="text-xs sm:text-sm md:text-base">Agregar nueva colmena</span>
        </button>
      </div>

      <ColmenasResumen />
    </div>
  );
}

export default Colmenas;
