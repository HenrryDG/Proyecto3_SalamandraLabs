import { useState } from "react";
import { deleteSolicitud } from "../../services/solicitud/solicitudService";
import { toast } from "sonner";

export function useDeleteSolicitud() {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteSol = async (id: number): Promise<boolean> => {
        setIsDeleting(true);

        try {
            await deleteSolicitud(id);
            toast.success("Solicitud eliminada exitosamente");
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.mensaje || "Error al eliminar la solicitud");
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        deleteSol,
        isDeleting,
    };
}
