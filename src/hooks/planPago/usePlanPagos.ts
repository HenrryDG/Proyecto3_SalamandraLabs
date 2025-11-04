import { useState, useEffect } from 'react';
import { PlanPago } from '../../types/planPago';
import { planPagoService } from '../../services/planPago/planPagoService';

export const usePlanPagos = (prestamoId: number | null) => {
    const [planPagos, setPlanPagos] = useState<PlanPago[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlanPagos = async () => {
        if (!prestamoId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await planPagoService.obtenerPlanPagosPorPrestamo(prestamoId);
            setPlanPagos(data);
        } catch (err: any) {
            setError(err.response?.data?.mensaje || 'Error al cargar el plan de pagos');
            console.error('Error fetching plan pagos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlanPagos();
    }, [prestamoId]);

    return {
        planPagos,
        loading,
        error,
        refetch: fetchPlanPagos,
    };
};
