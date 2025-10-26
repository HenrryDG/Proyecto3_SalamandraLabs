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
  // Debe ser solo números, con a lo sumo una letra al final
  if (!/^\d+[A-Za-z]?$/.test(carnet)) return "El carnet debe contener solo números y, opcionalmente, una única letra al final";
  return null;
};

// Validar complemento: opcional, máximo 2 caracteres (1 número y 1 letra), sin caracteres especiales
export const validarComplemento = (complemento: string): string | null => {
  if (!complemento || complemento.trim() === "") return null; // opcional
  
  // Validar que solo contenga alfanuméricos (sin caracteres especiales)
  if (!/^[A-Za-z0-9]+$/.test(complemento)) return "El complemento no puede contener caracteres especiales";
  
  // Contar números y letras
  const numCount = (complemento.match(/\d/g) || []).length;
  const letterCount = (complemento.match(/[A-Za-z]/g) || []).length;
  
  if (numCount > 1) return "El complemento no puede tener más de un número";
  if (letterCount > 1) return "El complemento no puede tener más de una letra";
  if (complemento.length > 2) return "El complemento no puede tener más de 2 caracteres";
  
  return null;
};

// Validar carnet dependiendo del complemento
export const validarCarnetConComplemento = (carnet: string, complemento?: string): string | null => {
  if (!carnet || carnet.trim() === "") return "El carnet es obligatorio";
  
  const c = complemento?.trim() || "";

  if (!c) {
    // Sin complemento: máximo 8 dígitos
    if (!/^\d{1,8}$/.test(carnet)) return "Sin complemento, el carnet debe tener hasta 8 números";
  } else {
    // Con complemento: exactamente 7 dígitos
    if (!/^\d{1,7}$/.test(carnet)) return "Con complemento, el carnet debe tener hasta 7 números";
  }

  return null;
};


export const validarCorreo = (correo: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo)) return "El correo no es válido";
  return null;
};

// Valida que el correo pertenezca a proveedores permitidos (por defecto: gmail, hotmail, yahoo)
export const validarCorreoExtension = (correo: string, allowedExtensions?: string[]): string | null => {
  const emailMatch = correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (!emailMatch) return "El correo no es válido";

  const domain = correo.split("@")[1].toLowerCase();
  const extension = domain.split(".").pop() ?? ""; // obtiene lo que va después del último punto

  const defaults = ["com", "net", "org", "edu", "bo", "es"];
  const extensions = (allowedExtensions && allowedExtensions.length > 0)
    ? allowedExtensions.map(ext => ext.toLowerCase())
    : defaults;

  if (!extensions.includes(extension)) {
    return `El correo debe tener una extensión válida (${extensions.join(", ")})`;
  }

  return null;
};


// Valida que la contraseña sea segura: longitud mínima, mayúscula, minúscula, número y carácter especial
export const validarContrasena = (password: string, min: number = 8): string | null => {
  if (password.trim() === "") return "La contraseña es obligatoria";
  if (password.length < min) return `La contraseña debe tener al menos ${min} caracteres`;

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/~`+=;:]/.test(password);

  if (!hasUpper) return "La contraseña debe contener al menos una letra mayúscula";
  if (!hasLower) return "La contraseña debe contener al menos una letra minúscula";
  if (!hasDigit) return "La contraseña debe contener al menos un número";
  if (!hasSpecial) return "La contraseña debe contener al menos un carácter especial";

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
