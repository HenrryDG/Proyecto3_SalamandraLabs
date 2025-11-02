import api from "../axios";
import { Documento } from "../../types/documento";

// * === SERVICIO PARA OBTENER TODOS LOS DOCUMENTOS === * //

export const getDocumentos = async (solicitud_id: number): Promise<Documento[]> => {
  const response = await api.get<Documento[]>(`/documentos/${solicitud_id}/`);
  return response.data;
};

// * === SERVICIO PARA SUBIR LA FOTOCOPIA DEL CARNET === * //
export const verificarCarnetOCR = async (
  file: File,
  solicitud_id: number
): Promise<void> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("solicitud_id", solicitud_id.toString());
  formData.append("tipo_documento", "Fotocopia de carnet");

  const response = await fetch(import.meta.env.VITE_OCR_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir la fotocopia de carnet");
  }

};

// * === SERVICIO PARA SUBIR LA FACTURA (LUZ, AGUA O GAS) === * //

export const verificarFacturaOCR = async (
  file: File,
  solicitud_id: number,
  tipo_documento: "Factura de luz" | "Factura de gas" | "Factura de agua"
): Promise<void> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("solicitud_id", solicitud_id.toString());
  formData.append("tipo_documento", tipo_documento);

  const response = await fetch(import.meta.env.VITE_OCR_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir la factura");
  }

  // Nada más: backend responde 200, no JSON
};

// * === SERVICIO PARA SUBIR LA BOLETA DE PAGO === * //
export const verificarBoletaOCR = async (
  file: File,
  solicitud_id: number
): Promise<void> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("solicitud_id", solicitud_id.toString());
  formData.append("tipo_documento", "Boleta de pago");
  const response = await fetch(import.meta.env.VITE_OCR_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir la boleta de pago");
  } 
  // Nada más: backend responde 200, no JSON
};
