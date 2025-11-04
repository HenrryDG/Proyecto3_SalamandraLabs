import { useState } from "react";
import { Modal } from "../../ui/modal";
import PlanPagoTable from "../../tables/planPago/PlanPagoTable";
import PagarCuotaModal from "./PagarCuotaModal";
import { usePlanPagos } from "../../../hooks/planPago/usePlanPagos";
import { usePagarCuota } from "../../../hooks/planPago/usePagarCuota";
import { PlanPago, MetodoPago } from "../../../types/planPago";
import { toast } from "sonner";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    prestamoId: number | null;
    clienteNombre?: string;
};

export default function PlanPagosModal({
    isOpen,
    onClose,
    prestamoId,
    clienteNombre,
}: Props) {
    const { planPagos, loading, error, refetch } = usePlanPagos(prestamoId);
    const { pagarCuota, loading: pagando, error: errorPago } = usePagarCuota();
    
    const [selectedPlanPago, setSelectedPlanPago] = useState<PlanPago | null>(null);
    const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);

    const handlePagar = (planPago: PlanPago) => {
        setSelectedPlanPago(planPago);
        setIsPagoModalOpen(true);
    };

    const handleConfirmPago = async (metodoPago: MetodoPago) => {
        if (!selectedPlanPago) return;

        const success = await pagarCuota(selectedPlanPago.id, metodoPago);
        
        if (success) {
            toast.success("Pago procesado exitosamente");
            setIsPagoModalOpen(false);
            setSelectedPlanPago(null);
            await refetch();
        } else {
            toast.error(errorPago || "Error al procesar el pago");
        }
    };

    const handleClosePagoModal = () => {
        setIsPagoModalOpen(false);
        setSelectedPlanPago(null);
    };

    // Calcular totales
    const totales = planPagos.reduce(
        (acc, plan) => {
            const monto = parseFloat(plan.monto_cuota);
            const mora = parseFloat(plan.mora_cuota);
            
            acc.totalMora += mora;
            
            if (plan.estado === 'Pagada') {
                acc.pagado += monto + mora;
                acc.cuotasPagadas += 1;
            } else {
                acc.pendiente += monto + mora;
                acc.cuotasPendientes += 1;
            }
            
            return acc;
        },
        { pagado: 0, pendiente: 0, totalMora: 0, cuotasPagadas: 0, cuotasPendientes: 0 }
    );

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                className="max-w-7xl p-6 sm:p-8"
            >
                <div className="space-y-6">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Plan de Pagos{clienteNombre ? ` - ${clienteNombre}` : ''}
                    </h2>
                    
                    {/* Resumen del plan - Oculto en móviles */}
                    <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Cuotas</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {planPagos.length}
                            </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cuotas Pagadas</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {totales.cuotasPagadas}
                            </p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cuotas Pendientes</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {totales.cuotasPendientes}
                            </p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Pagado</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                Bs. {totales.pagado.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Pendiente</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                Bs. {totales.pendiente.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Mora</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                Bs. {totales.totalMora.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Tabla de plan de pagos */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                            {error}
                        </div>
                    ) : planPagos.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No hay plan de pagos disponible
                        </div>
                    ) : (
                        <PlanPagoTable 
                            planPagos={planPagos}
                            onPagar={handlePagar}
                        />
                    )}
                </div>
            </Modal>

            {/* Modal de pago */}
            {selectedPlanPago && (
                <PagarCuotaModal
                    isOpen={isPagoModalOpen}
                    onClose={handleClosePagoModal}
                    onConfirm={handleConfirmPago}
                    montoCuota={selectedPlanPago.monto_cuota}
                    moraCuota={selectedPlanPago.mora_cuota}
                    loading={pagando}
                />
            )}
        </>
    );
}
