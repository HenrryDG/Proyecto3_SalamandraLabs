import { useEffect, useState, useCallback } from "react";
import { getClientes } from "../../services/cliente/clienteService";
import { Cliente } from "../../types/cliente";


export const useClientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClientes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClientes();
            setClientes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar los clientes");
            setClientes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect( () => {
        fetchClientes();
    }, [fetchClientes]);

    return { clientes, loading, error, refetch: fetchClientes};
}
