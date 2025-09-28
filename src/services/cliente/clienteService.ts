import api from "../axios";
import { Cliente, ClienteDTO } from "../../types/cliente";

// * === SERVICIO PARA OBTENER TODOS LOS CLIENTES === * //

export const getClientes = async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>("/clientes/");
    return response.data;
}

// * === SERVICIO PARA INSERTAR UN NUEVO CLIENTE === * //

export const createCliente = async (payload: ClienteDTO): Promise<void> => {
  await api.post("/clientes/", payload);
};

// * === SERVICIO PARA ACTUALIZAR UN CLIENTE === * //
export const updateCliente = async (cliente: Cliente): Promise<Cliente> => {
    const response = await api.put<Cliente>(`/clientes/${cliente.id}/`, cliente);
    return response.data;
}

// * === SERVICIO PARA HABILITAR/DESHABILITAR UN CLIENTE === * //
export const toggleCliente = async (id: number): Promise<{ mensaje: string}> => {
    const response = await api.patch(`/clientes/${id}/`);
    return response.data.mensaje;
}