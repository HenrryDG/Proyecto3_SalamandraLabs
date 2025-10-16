import { useState } from "react";
import { toggleSolicitud } from "../../services/solicitud/solicitudService";
import { toast } from "sonner";

export function useToggleSolicitud() {
    const [isToggling, setIsToggling] = useState(false);

    const toggle = async (id: number, estado: string): Promise<boolean> => {
        setIsToggling(true);

        try {
            await toggleSolicitud(id, estado);
            toast.success("Estado de solicitud actualizado");
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.error || err.response?.data?.mensaje || "Error al cambiar estado de la solicitud");
            return false;
        } finally {
            setIsToggling(false);
        }
    };

    return {
        toggle,
        isToggling,
    };
}
