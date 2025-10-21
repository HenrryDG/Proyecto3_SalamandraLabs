import { useState } from "react";
import { toast } from "sonner";
import { verificarFacturaOCR } from "../../services/documento/documentoService";

export function useUploadFactura(solicitudId: number) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file?: File, tipoFactura?: string, onSuccess?: () => void) => {
    if (!file) return toast.warning("Selecciona un archivo primero.");
    if (!tipoFactura) return toast.warning("Debe especificar el tipo de factura");
    setUploading(true);

    try {
      await verificarFacturaOCR(file, solicitudId, tipoFactura as any);
      toast.success("Factura subida y verificada correctamente");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Error al subir la factura");
    } finally {
      setUploading(false);
    }
  };

  return { uploading, upload };
}
