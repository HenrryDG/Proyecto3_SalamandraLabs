import api from "../axios";
import { Solicitud } from "../../types/solicitud";
import { SolicitudDTO } from "../../components/form/configs/solicitudFormConfig";

export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const response = await api.get<Solicitud[]>("/solicitudes/");
  return response.data;
};

// * === SERVICIO PARA INSERTAR UNA NUEVA SOLICITUD === * //
export const createSolicitud = async (payload: SolicitudDTO): Promise<void> => {
  await api.post("/solicitudes/", payload);
};

// * === SERVICIO PARA ACTUALIZAR UNA SOLICITUD === * //
export const updateSolicitud = async (solicitud: Solicitud): Promise<Solicitud> => {
  const response = await api.put<Solicitud>(`/solicitudes/${solicitud.id}/`, solicitud);
  return response.data;
}

// * === SERVICIO PARA CAMBIAR ESTADO DE UNA SOLICITUD === * //
export const toggleSolicitud = async (id: number, estado: string): Promise<{ mensaje: string; solicitud_id: number; estado: string; fecha_aprobacion: string }> => {
  const response = await api.patch(`/solicitudes/${id}/`, { estado });
  return response.data;
}
