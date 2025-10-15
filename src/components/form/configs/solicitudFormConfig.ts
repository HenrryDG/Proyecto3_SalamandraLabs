import {
    validarTexto,
    validarLongitud,
    validarTextoMinimo
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
        { key: "monto_solicitado", label: "Monto Solicitado", validator: (v) => !v ? "Campo obligatorio" : null },
        { key: "proposito", label: "Propósito", validator: (v) => validarTextoMinimo(v, 5) || validarTexto(v) },
        { key: "plazo_meses", label: "Plazo (meses)", type: "number", validator: (v) => !v ? "Campo obligatorio" : null },
        { key: "observaciones", label: "Observaciones", validator: (v) => !v ? null : validarLongitud(v, 0, 500) },
    ];

export const maxLengths: Record<FormKeys, number> = {
    cliente: 10,
    monto_solicitado: 20,
    proposito: 200,
    plazo_meses: 3,
    observaciones: 500,
};

export const getMaxLength = (key: FormKeys) => maxLengths[key] || undefined;

// Campos obligatorios (excepto observaciones)
export const camposObligatorios: FormKeys[] = campos
    .filter(c => c.key !== "observaciones")
    .map(c => c.key);
