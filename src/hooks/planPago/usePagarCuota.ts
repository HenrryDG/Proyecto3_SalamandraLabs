import { useState } from 'react';
import { planPagoService } from '../../services/planPago/planPagoService';
import { MetodoPago } from '../../types/planPago';

export const usePagarCuota = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pagarCuota = async (planId: number, metodoPago: MetodoPago): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await planPagoService.actualizarPlanPago(planId, {
                metodo_pago: metodoPago,
                estado: 'Pagada',
            });
            return true;
        } catch (err: any) {
            const errorMsg = err.response?.data?.mensaje || 
                            err.response?.data?.errores?.metodo_pago?.[0] ||
                            err.response?.data?.errores?.estado?.[0] ||
                            'Error al procesar el pago';
            setError(errorMsg);
            console.error('Error pagando cuota:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        pagarCuota,
        loading,
        error,
    };
};
