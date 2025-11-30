export const validarDatosColmena = (datos) => {
  const errores = [];

  if (!datos.colmenaId?.trim()) {
    errores.push("El identificador de la colmena es obligatorio.");
  }

  if (!datos.nombreColmena?.trim()) {
    errores.push("El nombre de la colmena es obligatorio.");
  }

  if (!datos.areaUbicacion?.trim()) {
    errores.push("El área o ubicación es obligatoria.");
  }

  if (!datos.tipoColmena?.trim()) {
    errores.push("El tipo de colmena es obligatorio.");
  }

  if (!datos.mac?.trim()) {
    errores.push("La dirección MAC es obligatoria.");
  } else if (!/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/.test(datos.mac.trim())) {
    errores.push("La MAC debe tener el formato 00:11:22:33:44:55.");
  }

  return errores;
};
