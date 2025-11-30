import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "/BeeHappy1.png";

const navItems = [
  { to: "/", label: "Inicio", icon: <img src="/home-icon.png" alt="Inicio" className="w-6 h-6" /> },
  { to: "/colmenas", label: "Colmenas", icon: <img src="/colmena-icon.png" alt="Colmenas" className="w-6 h-6" /> },
  { to: "/estadisticas", label: "Estadísticas", icon: <img src="/estadisticas-icon.png" alt="Estadísticas" className="w-6 h-6" /> },
  { to: "/monitoreo", label: "Monitoreo", icon: <img src="/monitoreo-icon.png" alt="Monitoreo" className="w-6 h-6" /> },
  { to: "/alertas", label: "Alertas", icon: <img src="/alertas-icon.png" alt="Alertas" className="w-6 h-6" /> },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#0B547A] rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0  w-64 bg-[#06192D] text-white z-40 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:flex md:flex-col
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo */}
          <div className="flex justify-center items-center p-6 py-8 shrink-0">
            <img src={logo} alt="BeeHappy" className="w-[80px] h-[80px] rounded-full" />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 px-4 flex-grow">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                    isActive ? "bg-[#0B547A]" : "hover:bg-[#0B547A]/60"
                  }`
                }
                onClick={() => setIsOpen(false)} // cerrar al hacer clic en móvil
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
          </nav>

          
        </div>
      </aside>

      {/* Overlay en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
