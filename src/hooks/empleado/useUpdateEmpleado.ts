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
            const data = err?.response?.data;
            let mensaje = "Error al actualizar el empleado";

            if (data) {
                if (typeof data === "string") {
                    mensaje = data;
                } else if (data.mensaje) {
                    mensaje = data.mensaje;
                }

                // Si hay errores del serializer (por campo)
                if (data.errores) {
                    const errores = data.errores;
                    const primerCampo = Object.keys(errores)[0];
                    const primerMensaje = errores[primerCampo]?.[0];
                    if (primerMensaje) mensaje = primerMensaje;
                }

                // Si vino directamente en 'error'
                if (data.error && typeof data.error === "string") {
                    mensaje = data.error;
                }
            }

            toast.error(mensaje);
            setError(mensaje);
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