export const validarTelefono = (telefono: string): string | null => {
  if (telefono.trim() === "") return "El teléfono es obligatorio";
  const num = Number(telefono);
  if (!/^\d{8}$/.test(telefono)) return "El teléfono debe tener 8 dígitos y solo números";
  if (num < 60000000 || num > 79999999) return "El teléfono debe ser válido";

  return null;
};

export const validarTexto = (valor: string) => {
  if (valor.trim() === "") return `El campo es obligatorio`;
  if (!/^[a-zA-Z\u00E0-\u00FC\u00C0-\u017F ]+$/.test(valor)) return `El campo debe contener solo letras y espacios`;
  return null;
};

export const validarTextoMinimo = (valor: string, min: number) => {
  if (valor.trim() === "") return `El campo es obligatorio`;
  if (valor.length < min) return `El campo debe tener al menos ${min} caracteres`;
  return null;
};

export const validarLongitud = (valor: string, min: number, max: number): string | null => {
  if (valor.trim() === "") return `El campo es obligatorio`;
  if (valor.length < min || valor.length > max) return `El campo debe tener entre ${min} y ${max} caracteres`;
  return null;
};


export const validarIngreso = (ingreso: string): string | null => {
  if (ingreso.trim() === "") return "El ingreso mensual es obligatorio";
  const num = Number(ingreso);
  if (isNaN(num) || num <= 0) return "El ingreso mensual debe ser mayor que 0";
  return null;
}

export const validarCarnet = (carnet: string, min: number): string | null => {
  if (carnet.trim() === "") return "El carnet es obligatorio";
  if (carnet.length < min) return `El carnet debe tener al menos ${min} caracteres`;
  if (!/^[a-zA-Z0-9]+$/.test(carnet)) return "El carnet debe contener solo letras y números";
  return null;
};

export const validarCorreo = (correo: string): string | null => {
  if (correo.trim() === "") return "El correo es obligatorio";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) return "El correo no es válido";
  return null;
};

/* SOLICITUDES */
export const validarMontoSolicitado = (monto: string): string | null => {
  if (monto.trim() === "") return "El monto solicitado es obligatorio";
  const num = Number(monto);
  if (isNaN(num) || num <= 99) return "El monto solicitado debe ser mayor que 99";
  return null;
};

export const validarPlazoMeses = (plazo: string): string | null => {
  if (plazo.trim() === "") return "El plazo es obligatorio";
  const num = Number(plazo);
  if (isNaN(num) || num <= 0) return "El plazo debe ser mayor que 0";
  if (num > 99) return "El plazo no puede ser mayor a 99 meses";
  return null;
};
