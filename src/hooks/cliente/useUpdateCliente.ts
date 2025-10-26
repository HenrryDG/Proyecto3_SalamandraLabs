import { useState } from "react";
import { updateCliente } from "../../services/cliente/clienteService";
import { Cliente } from "../../types/cliente";
import { toast } from "sonner";

export function useUpdateCliente() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (cliente: Cliente): Promise<Cliente | null> => {
        setIsUpdating(true);
        setError(null);

        try {
            const updated = await updateCliente(cliente);
            toast.success("Cliente actualizado exitosamente");
            return updated;

        } catch (err: any) {
            const data = err?.response?.data;
            let mensaje = "Error al actualizar el cliente";

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
