import { useEffect, useState, useCallback } from "react";
import { getClientesHabilitados } from "../../services/cliente/clienteService";
import { Cliente } from "../../types/cliente";


export const useClientesHabilitados = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClientes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClientesHabilitados();
            setClientes(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar los clientes habilitados");
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
