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


