import api from "../axios";
import { Empleado } from "../../types/empleado";

// * === SERVICIO PARA OBTENER TODOS LOS EMPLEADOS === * //
export const getEmpleados = async (): Promise<Empleado[]> => {
    const response = await api.get<Empleado[]>("/empleados/");
    return response.data;
};