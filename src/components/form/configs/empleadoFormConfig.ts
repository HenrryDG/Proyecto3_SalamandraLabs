import {
    validarTexto,
    validarTelefono,
    validarCorreo,
    validarCorreoProveedor,
    validarContrasena,
    validarLongitud,
    validarTextoMinimo
} from "../../utils/validaciones";

import { EmpleadoDTO } from "../../../types/empleado";
import { EmpleadoEditDTO } from "../../../types/empleado";

// ================= Crear Empleado =================

export type FormKeys = keyof EmpleadoDTO;

export const campos: {
    key: FormKeys;
    label: string;
    type?: string;
    validator: (val: string) => string | null;
}[] = [
        { key: "nombre", label: "Nombre", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
        { key: "apellido_paterno", label: "Apellido Paterno", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
        { key: "apellido_materno", label: "Apellido Materno", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
        { key: "correo", label: "Correo", type: "email", validator: (v) => validarLongitud(v, 1, 50) || validarCorreo(v) || validarCorreoProveedor(v) },
        { key: "telefono", label: "Teléfono", validator: validarTelefono },
        { key: "rol", label: "Rol", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
        { key: "username", label: "Usuario", validator: (v) => validarLongitud(v, 3, 20) },
        { key: "password", label: "Contraseña", type: "password", validator: (v) => validarContrasena(v, 8) }
    ];

export const maxLengths: Record<FormKeys, number> = {
    username: 20,
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
export const camposObligatorios: FormKeys[] = campos.map(c => c.key);


// ================= Editar Empleado =================

export type EditFormKeys = keyof EmpleadoEditDTO;

export const camposEdit: {
    key: EditFormKeys;
    label: string;
    type?: string;
    validator: (val: string) => string | null;
}[] = [
        { key: "rol", label: "Rol", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
        { key: "nombre", label: "Nombre", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
        { key: "apellido_paterno", label: "Apellido Paterno", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
        { key: "apellido_materno", label: "Apellido Materno", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
        { key: "correo", label: "Correo", type: "email", validator: (v) => !v ? null : validarLongitud(v, 1, 50) || validarCorreo(v) },
        { key: "telefono", label: "Teléfono", validator: validarTelefono },
    ];

export const maxLengthsEdit: Record<EditFormKeys, number> = {
    telefono: 8,
    correo: 50,
    nombre: 30,
    apellido_paterno: 30,
    apellido_materno: 30,
    rol: 20,
};

export const getMaxLengthEdit = (key: EditFormKeys) => maxLengthsEdit[key] || undefined;

export const camposObligatoriosEdit: EditFormKeys[] = camposEdit
    .filter(c => c.key !== "correo")
    .map(c => c.key);
