import api from "../axios";
import { Empleado } from "../../types/empleado";

// * === SERVICIO PARA OBTENER EL EMPLEADO AUTENTICADO === * //

export const getEmpleadoAutenticado = async (): Promise<Empleado> => {
    const response = await api.get<Empleado>("/empleados/perfil/");

    localStorage.setItem("rol", response.data.rol);

    return response.data;
};