import api from "../axios";
import { Solicitud } from "../../types/solicitud";

export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const response = await api.get<Solicitud[]>("/solicitudes/");
  return response.data;
};

// Note: create/update endpoints omitted for now per requirements.
