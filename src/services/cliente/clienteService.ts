import api from "../axios";
import { Cliente } from "../../types/cliente";

// * === SERVICIO PARA OBTENER TODOS LOS CLIENTES === * //

export const getClientes = async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>("/clientes/");
    return response.data;
}

