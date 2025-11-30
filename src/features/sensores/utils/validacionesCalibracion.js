export function validarDatosCalibracion({ factor, offset, valorMax, valorMin, fecha }) {
  const errores = [];

  if (factor === '' || isNaN(Number(factor))) errores.push('El factor de calibración es obligatorio y debe ser numérico.');
  if (offset === '' || isNaN(Number(offset))) errores.push('El ajuste de calibración es obligatorio y debe ser numérico.');
  if (valorMax === '' || isNaN(Number(valorMax))) errores.push('El valor máximo es obligatorio y debe ser numérico.');
  if (valorMin === '' || isNaN(Number(valorMin))) errores.push('El valor mínimo es obligatorio y debe ser numérico.');
  if (!fecha) errores.push('La fecha de calibración es obligatoria.');

  const numMax = Number(valorMax);
  const numMin = Number(valorMin);
  if (!isNaN(numMax) && !isNaN(numMin) && numMin > numMax) {
    errores.push('El valor mínimo no puede ser mayor que el valor máximo.');
  }

  return errores;
}
