import { getColmenaByUsuario } from "../../colmenas/services/get_colmena_byUsuario";

export const getHivesSummary = async () => {
  const hives = await getColmenaByUsuario(); // <-- ya es un array directo

  console.log("📦 Colmenas recibidas:", hives); // verificación útil

  const summary = {
    registered: hives.length,
    active: hives.filter(h => h.estado?.toLowerCase() === 'activo').length,
    pending: hives.filter(h => h.estado?.toLowerCase() === 'pending').length,
    completed: hives.filter(h => h.estado?.toLowerCase() === 'completed').length,
  };

  console.log("✅ Summary generado:", summary);

  return summary;
};
