import api from "../axios";
import { Prestamo } from "../../types/prestamo";

// * === SERVICIO PARA OBTENER TODOS LOS PRÉSTAMOS === * //
export const getPrestamos = async (): Promise<Prestamo[]> => {
    const response = await api.get<Prestamo[]>("/prestamos/");
    return response.data;
}

// * === SERVICIO PARA CREAR UN PRÉSTAMO === * //
export const createPrestamo = async (prestamoData: { solicitud: number; fecha_desembolso: string; }): Promise<Prestamo> => {
    const response = await api.post<Prestamo>("/prestamos/", prestamoData);
    return response.data;
}