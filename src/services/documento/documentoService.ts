import api from "../axios";
import { Documento } from "../../types/documento";

// * === SERVICIO PARA OBTENER TODOS LOS DOCUMENTOS === * //

export const getDocumentos = async (documento_id: number):Promise<Documento[]> => {
    const response = await api.get<Documento[]>(`/documentos/${documento_id}/`)
    return response.data;
}