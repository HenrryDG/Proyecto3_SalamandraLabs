import api from "../axios";
import { Prestamo } from "../../types/prestamo";

// * === SERVICIO PARA OBTENER TODOS LOS PRÉSTAMOS === * //
export const getPrestamos = async (): Promise<Prestamo[]> => {
    const response = await api.get<Prestamo[]>("/prestamos/");
    return response.data;
}