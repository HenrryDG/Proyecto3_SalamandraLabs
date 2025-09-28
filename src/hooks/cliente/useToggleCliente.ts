import { useState } from "react";
import { toggleCliente } from "../../services/cliente/clienteService";
import { toast } from "sonner";

export function useToggleCliente() {
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async (id: number): Promise<void> => {
    setIsToggling(true);
    setError(null);

    try {
      const response = await toggleCliente(id); // { mensaje, cliente_id, estado }
      toast.success(response.mensaje || "Cliente actualizado exitosamente");
    } catch (err: any) {
      toast.error(err.response?.data?.mensaje || "Error al actualizar el cliente");
    } finally {
      setIsToggling(false);
    }
  };

  return {
    toggle,
    isToggling,
    error,
  };
}
