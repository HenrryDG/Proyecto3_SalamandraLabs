import { useState } from "react";
import { toast } from "sonner";
import { verificarCarnetOCR } from "../../services/documento/documentoService";

export function useUploadCarnet(solicitudId: number) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file?: File, onSuccess?: () => void) => {
    if (!file) return toast.warning("Selecciona un archivo primero.");
    setUploading(true);

    try {
      await verificarCarnetOCR(file, solicitudId);
      toast.success("Carnet subido y verificado correctamente");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Error al subir el carnet");
    } finally {
      setUploading(false);
    }
  };

  return { uploading, upload };
}
