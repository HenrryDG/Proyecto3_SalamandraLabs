import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCliente } from "../../services/cliente/clienteService";
import { toast } from "sonner";

export const useCreateCliente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCliente,
        onSuccess: () => {
            toast.success("Cliente creado exitosamente.");
            queryClient.invalidateQueries({ queryKey: ["clientes"] });
        },
        onError: (error: any) => {
            // Intenta extraer el mensaje desde error.response.data.error o error.response.data.message
            const mensaje =
                error?.response?.data?.error ||
                error?.response?.data?.mensaje ||
                "Error al registrar empleado";

            toast.error(mensaje);
        }
    })
}