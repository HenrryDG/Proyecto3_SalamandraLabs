import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPrestamo } from "../../services/prestamo/prestamoService";
import { toast } from "sonner";

export const useCreatePrestamo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPrestamo,
        onSuccess: () => {
            toast.success("Préstamo creado exitosamente.");
            queryClient.invalidateQueries({ queryKey: ["prestamos"] });
        },
        onError: (error: any) => {
            const mensaje =
                error?.response?.data?.error ||
                error?.response?.data?.mensaje ||
                "Error al registrar el préstamo";

            toast.error(mensaje);
        }
    })
}
