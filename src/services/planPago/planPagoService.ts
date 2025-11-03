import axios from '../axios';
import { PlanPago, PlanPagoActualizacion } from '../../types/planPago';

export const planPagoService = {
    // Obtener plan de pagos de un préstamo
    obtenerPlanPagosPorPrestamo: async (prestamoId: number): Promise<PlanPago[]> => {
        const response = await axios.get(`/prestamos/${prestamoId}/plan-pagos/`);
        return response.data;
    },

    // Actualizar un plan de pago (marcar como pagado y/o cambiar método de pago)
    actualizarPlanPago: async (planId: number, data: PlanPagoActualizacion): Promise<PlanPago> => {
        const response = await axios.patch(`/plan-pagos/plan-pagos/${planId}/`, data);
        return response.data;
    },
};
