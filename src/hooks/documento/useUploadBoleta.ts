import { useState } from "react";
import { toast } from "sonner";
import { verificarBoletaOCR } from "../../services/documento/documentoService";

export function useUploadBoleta(solicitudId: number) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file?: File, onSuccess?: () => void) => {
    if (!file) return toast.warning("Selecciona un archivo primero.");
    setUploading(true);

    try {
      await verificarBoletaOCR(file, solicitudId);
      toast.success("Boleta de pago subida y verificada correctamente");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Error al subir la boleta de pago");
    } finally {
      setUploading(false);
    }
  };

  return { uploading, upload };
}
