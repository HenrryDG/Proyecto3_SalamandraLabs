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
            const mensaje =
                error?.response?.data?.error ||
                error?.response?.data?.mensaje ||
                "Error al registrar empleado";

            toast.error(mensaje);
        }
    })
}
