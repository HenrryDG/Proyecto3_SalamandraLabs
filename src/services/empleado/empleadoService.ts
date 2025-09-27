import api from "../axios";
import { Empleado } from "../../types/empleado";

// * === SERVICIO PARA OBTENER EL EMPLEADO AUTENTICADO === * //

export const getEmpleadoAutenticado = async (): Promise<Empleado> => {
    const response = await api.get<Empleado>("/empleados/perfil/");
    return response.data;
};