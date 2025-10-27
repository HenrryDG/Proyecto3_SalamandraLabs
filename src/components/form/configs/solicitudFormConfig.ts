import {
    validarMontoSolicitado,
    validarPlazoMeses
} from "../../utils/validaciones";

export interface SolicitudDTO {
    cliente: number;
    monto_solicitado: string;
    proposito: string;
    plazo_meses: number;
    observaciones?: string;
}

export type FormKeys = keyof SolicitudDTO;

export const campos: {
    key: FormKeys;
    label: string;
    type?: string;
    validator: (val: string) => string | null;
}[] = [
        { key: "cliente", label: "Cliente", validator: (v) => !v ? "Campo obligatorio" : null },
        { key: "monto_solicitado", label: "Monto Solicitado", validator: validarMontoSolicitado },
        { 
            key: "proposito", 
            label: "Propósito", 
            validator: (v) => {
                if (!v || v.trim() === "") return "El campo es obligatorio";
                if (v.trim().length < 5) return "El campo debe tener al menos 5 caracteres";
                if (v.length > 500) return "El campo no puede exceder 500 caracteres";
                if (!/^[a-zA-Z\u00E0-\u00FC\u00C0-\u017F ]+$/.test(v)) return "El campo debe contener solo letras y espacios";
                return null;
            }
        },
        { key: "plazo_meses", label: "Plazo (meses)", type: "number", validator: validarPlazoMeses },
        { 
            key: "observaciones", 
            label: "Observaciones", 
            validator: (v) => {
                if (!v || v === "") return null; // Opcional
                if (v.trim() === "") return "No se permiten solo espacios en blanco";
                if (v.length > 500) return "El campo no puede exceder 500 caracteres";
                if (!/^[a-zA-Z\u00E0-\u00FC\u00C0-\u017F ]+$/.test(v)) return "El campo debe contener solo letras y espacios";
                return null;
            }
        },
    ];

export const maxLengths: Record<FormKeys, number> = {
    cliente: 10,
    monto_solicitado: 20,
    proposito: 500,
    plazo_meses: 3,
    observaciones: 500,
};

export const getMaxLength = (key: FormKeys) => maxLengths[key] || undefined;

// Campos obligatorios (excepto observaciones)
export const camposObligatorios: FormKeys[] = campos
    .filter(c => c.key !== "observaciones")
    .map(c => c.key);
