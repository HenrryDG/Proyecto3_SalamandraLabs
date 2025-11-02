import { useCallback, useEffect, useState } from "react";
import { getPrestamos } from "../../services/prestamo/prestamoService";
import { Prestamo } from "../../types/prestamo";

export const usePrestamos = () => {
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPrestamos = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getPrestamos();
            setPrestamos(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar los préstamos");

        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrestamos();
    }, [fetchPrestamos]);

    return { prestamos, loading, error, refetch: fetchPrestamos };
}