import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSolicitud } from "../../services/solicitud/solicitudService";
import { toast } from "sonner";

export const useCreateSolicitud = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSolicitud,
        onSuccess: () => {
            toast.success("Solicitud creada exitosamente.");
            queryClient.invalidateQueries({ queryKey: ["solicitudes"] });
        },
        onError: (error: any) => {
            const mensaje =
                error?.response?.data?.error ||
                error?.response?.data?.mensaje ||
                "Error al registrar solicitud";

            toast.error(mensaje);
        }
    })
}
