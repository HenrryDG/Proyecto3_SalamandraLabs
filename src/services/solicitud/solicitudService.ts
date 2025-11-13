import api from "../axios";
import { Solicitud } from "../../types/solicitud";
import { SolicitudDTO } from "../../components/form/configs/solicitudFormConfig";

export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const response = await api.get<Solicitud[]>("/solicitudes/");
  return response.data;
};

// * === SERVICIO PARA INSERTAR UNA NUEVA SOLICITUD === * //
export const createSolicitud = async (payload: SolicitudDTO): Promise<Solicitud> => {
  const response = await api.post<Solicitud>("/solicitudes/", payload);
  return response.data;
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

// * === SERVICIO PARA ELIMINAR UNA SOLICITUD === * //
export const deleteSolicitud = async (id: number): Promise<{ mensaje: string }> => {
  const response = await api.delete<{ mensaje: string }>(`/solicitudes/${id}/`);
  return response.data;
}
