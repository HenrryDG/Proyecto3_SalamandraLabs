import { useEffect, useState, useCallback } from "react";
import { getEmpleados } from "../../services/empleado/empleadosService";
import { Empleado } from "../../types/empleado";

export const useEmpleados = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmpleados = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEmpleados();
            setEmpleados(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar los empleados");
            setEmpleados([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmpleados();
    }, [fetchEmpleados]);

    return { empleados, loading, error, refetch: fetchEmpleados };
}
