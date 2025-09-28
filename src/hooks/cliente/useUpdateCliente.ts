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

        try{
            const updated = await updateCliente(cliente);
            toast.success("Cliente actualizado exitosamente");
            return updated;
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Error al actualizar el cliente");
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