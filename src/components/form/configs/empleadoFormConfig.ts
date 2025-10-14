import {
    validarTexto,
    validarTelefono,
    validarCorreo,
    validarLongitud,
    validarTextoMinimo
} from "../../utils/validaciones";

import { EmpleadoDTO } from "../../../types/empleado";

export type FormKeys = keyof EmpleadoDTO;

export const campos: {
    key: FormKeys;
    label: string;
    type?: string;
    validator: (val: string) => string | null;
}[] = [
    { key: "user", label: "Usuario", validator: (v) => validarLongitud(v, 3, 20) },
    { key: "rol", label: "Rol", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
    { key: "password", label: "Contraseña", type: "password", validator: (v) => validarLongitud(v, 4, 100) || validarTexto(v) },
    { key: "nombre", label: "Nombre", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
    { key: "apellido_paterno", label: "Apellido Paterno", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
    { key: "apellido_materno", label: "Apellido Materno", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
    { key: "correo", label: "Correo", type: "email", validator: (v) => !v ? null : validarLongitud(v, 1, 50) || validarCorreo(v) },
    { key: "telefono", label: "Teléfono", validator: validarTelefono },
];

export const maxLengths: Record<FormKeys, number> = {
    user : 20,
    telefono: 8,
    correo: 50,
    nombre: 30,
    apellido_paterno: 30,
    apellido_materno: 30,
    rol: 20,
    password: 64,
};

export const getMaxLength = (key: FormKeys) => maxLengths[key] || undefined;

// Campos obligatorios (excepto correo)
export const camposObligatorios: FormKeys[] = campos
    .filter(c => c.key !== "correo")
    .map(c => c.key);
