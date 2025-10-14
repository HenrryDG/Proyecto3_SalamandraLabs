export type rol = {
    value: string | boolean | number;
    label: string;
}

export const roles: rol[] = [
    { value: "Administrador", label: "Administrador" },
    { value: "Asesor", label: "Asesor" },
]

export const estados: rol[] = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
]

export const estadosSolicitud: rol[] = [
    { value: "Aprobada", label: "Aprobada" },
    { value: "Rechazada", label: "Rechazada" },
    { value: "Pendiente", label: "Pendiente" },
]