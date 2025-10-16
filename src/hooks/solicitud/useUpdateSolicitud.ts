import { useState } from "react";
import { updateSolicitud } from "../../services/solicitud/solicitudService";
import { Solicitud } from "../../types/solicitud";
import { toast } from "sonner";

export function useUpdateSolicitud() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (solicitud: Solicitud): Promise<Solicitud | null> => {
        setIsUpdating(true);
        setError(null);

        try {
            const updated = await updateSolicitud(solicitud);
            toast.success("Solicitud actualizada exitosamente");
            return updated;
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Error al actualizar la solicitud");
            return null;
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        update,
        isUpdating,
        error,
    };
}
