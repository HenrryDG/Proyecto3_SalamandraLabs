import { useState } from "react";
import { toggleEmpleado } from "../../services/empleado/empleadosService";
import { toast } from "sonner";
export function useToggleEmpleado() {
    const [isToggling, setIsToggling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toggle = async (id: number): Promise<void> => {
        setIsToggling(true);
        setError(null);
        try {
            const response = await toggleEmpleado(id);
            toast.success(response?.mensaje || "Empleado actualizado exitosamente");
        } catch (err: any) {
            const msg = err.response?.data?.mensaje || "Error al actualizar el empleado";
            setError(msg);
            toast.error(msg);
            throw err;
        } finally {
            setIsToggling(false);
        }
    };
    return { toggle, isToggling, error };
}