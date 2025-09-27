import { useEffect, useState, useCallback } from "react";
import { Empleado } from "../../types/empleado";
import { getEmpleadoAutenticado } from "../../services/empleado/empleadoService";


export const useEmpleado = () => {
    const [empleado, setEmpleado] = useState<Empleado | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmpleado = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEmpleadoAutenticado();
            setEmpleado(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "No se pudo cargar el empleado.");
            setEmpleado(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmpleado();
    }, [fetchEmpleado]);

    return { empleado, loading, error, refetch: fetchEmpleado };
};