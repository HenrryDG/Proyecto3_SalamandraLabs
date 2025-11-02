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
    { value: "Todos", label: "Todos" },
    { value: "Aprobada", label: "Aprobada" },
    { value: "Rechazada", label: "Rechazada" },
    { value: "Pendiente", label: "Pendiente" },
]

export const estadosPrestamo: rol[] = [
    { value: "Todos", label: "Todos" },
    { value: "En Curso", label: "En Curso" },
    { value: "Completado", label: "Completado" },
    { value: "Mora", label: "Mora" },
]
