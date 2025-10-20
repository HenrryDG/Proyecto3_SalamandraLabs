export interface Documento {
    id: number;
    tipo_documento: string;
    archivo: JSON;
    verificado: boolean;
    solicitud: number
}