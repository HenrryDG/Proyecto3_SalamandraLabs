import {
  validarTexto,
  validarTelefono,
  validarCarnet,
  validarCorreo,
  validarIngreso,
  validarLongitud,
  validarTextoMinimo,
  validarCorreoExtension
} from "../../utils/validaciones";

import { ClienteDTO } from "../../../types/cliente";

export type FormKeys = keyof ClienteDTO;

export const campos: {
  key: FormKeys;
  label: string;
  type?: string;
  validator: (val: string) => string | null;
}[] = [
  { key: "carnet", label: "Carnet", validator: (v) => validarCarnet(v, 6) },
  { key: "nombre", label: "Nombre", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
  // Apellidos: solo validar si hay texto
  { key: "apellido_paterno", label: "Apellido Paterno", validator: (v) => !v ? null : validarTextoMinimo(v, 3) || validarTexto(v) },
  { key: "apellido_materno", label: "Apellido Materno", validator: (v) => !v ? null : validarTextoMinimo(v, 3) || validarTexto(v) },
  { key: "lugar_trabajo", label: "Lugar de Trabajo", validator: (v) => validarLongitud(v, 1, 60) || validarTexto(v) },
  { key: "tipo_trabajo", label: "Ocupación", validator: (v) => validarLongitud(v, 1, 30) || validarTexto(v) },
  { key: "ingreso_mensual", label: "Ingreso Mensual", type: "number", validator: validarIngreso },
  { key: "direccion", label: "Dirección", validator: (v) => validarLongitud(v, 1, 255) },
  { key: "correo", label: "Correo", type: "email", validator: (v) => !v ? null : validarLongitud(v, 1, 50) || validarCorreo(v) || validarCorreoExtension(v) },
  { key: "telefono", label: "Teléfono", validator: validarTelefono },
];

export const maxLengths: Record<FormKeys, number> = {
  telefono: 8,
  carnet: 12,
  lugar_trabajo: 60,
  tipo_trabajo: 30,
  direccion: 255,
  correo: 50,
  ingreso_mensual: 9,
  nombre: 30,
  apellido_paterno: 30,
  apellido_materno: 30,
};

export const getMaxLength = (key: FormKeys) => maxLengths[key] || undefined;

// Campos obligatorios (excepto correo y apellidos)
export const camposObligatorios: FormKeys[] = campos
  .filter(c => c.key !== "correo" && c.key !== "apellido_paterno" && c.key !== "apellido_materno")
  .map(c => c.key);
