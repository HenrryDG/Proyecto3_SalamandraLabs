import { useState } from "react";
import { updateEmpleado } from "../../services/empleado/empleadosService";
import { Empleado } from "../../types/empleado";
import { toast } from "sonner";

export function useUpdateEmpleado() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (empleado: Empleado): Promise<Empleado | null> => {
        setIsUpdating(true);
        setError(null);

        try {
            const updated = await updateEmpleado(empleado);
            toast.success("Empleado actualizado exitosamente");
            return updated;
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Error al actualizar el empleado");
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