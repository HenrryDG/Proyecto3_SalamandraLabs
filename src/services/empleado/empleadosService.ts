import api from "../axios";
import { Empleado, EmpleadoDTO } from "../../types/empleado";

// * === SERVICIO PARA OBTENER TODOS LOS EMPLEADOS === * //
export const getEmpleados = async (): Promise<Empleado[]> => {
    const response = await api.get<Empleado[]>("/empleados/");
    return response.data;
};

// * === SERVICIO PARA INSERTAR UN NUEVO EMPLEADO === * //
export const createEmpleado = async (payload: EmpleadoDTO): Promise<void> => {
    await api.post("/empleados/", payload);
};

// * === SERVICIO PARA ACTUALIZAR UN EMPLEADO === * //
export const updateEmpleado = async (empleado: Empleado): Promise<Empleado> => {
    const response = await api.put<Empleado>(`/empleados/${empleado.id}/`, empleado);
    return response.data;
}

// * === SERVICIO PARA HABILITAR/DESHABILITAR UN EMPLEADO === * //
export const toggleEmpleado = async (id: number): Promise<{ mensaje: string }> => {
    const response = await api.patch(`/empleados/${id}/`);
    return response.data;
}
