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