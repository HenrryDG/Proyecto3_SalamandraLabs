import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmpleado } from "../../services/empleado/empleadosService";
import { toast } from "sonner";

export const useCreateEmpleado = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEmpleado,
        onSuccess: () => {
            toast.success("Empleado creado exitosamente.");
            queryClient.invalidateQueries({ queryKey: ["empleados"] });
        },
        onError: (error: any) => {
            const data = error?.response?.data;

            // Detectar si hay errores de validación
            let mensaje = "Error al registrar empleado";

            if (data) {
                if (typeof data === "string") {
                    mensaje = data;
                }
                else if (data.mensaje) {
                    mensaje = data.mensaje;
                }

                // Si hay errores detallados del serializador

                if (data.errores) {
                    // Extraer el primer mensaje legible
                    const errores = data.errores;
                    const primerCampo = Object.keys(errores)[0];
                    const primerMensaje = errores[primerCampo][0];

                    if (primerMensaje) {
                        mensaje = primerMensaje;
                    }
                }
            }

            // Si no vino directamente en "error"
            if (data.error && typeof data.error === "string") {
                mensaje = data.error;
            }

            toast.error(mensaje);
        }
    })
}
