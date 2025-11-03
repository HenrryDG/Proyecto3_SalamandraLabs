import { useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import ConfirmacionModal from "../confirmacionModal";
import { MetodoPago } from "../../../types/planPago";
import { FaQrcode, FaMoneyBillWave } from "react-icons/fa";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (metodoPago: MetodoPago) => void;
    montoCuota: string;
    moraCuota: string;
    loading?: boolean;
};

export default function PagarCuotaModal({
    isOpen,
    onClose,
    onConfirm,
    montoCuota,
    moraCuota,
    loading = false,
}: Props) {
    const [selectedMethod, setSelectedMethod] = useState<MetodoPago | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const total = parseFloat(montoCuota) + parseFloat(moraCuota);

    const handleOpenConfirmModal = () => {
        if (selectedMethod) {
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirm = () => {
        if (selectedMethod) {
            onConfirm(selectedMethod);
            setIsConfirmModalOpen(false);
        }
    };

    const handleClose = () => {
        setSelectedMethod(null);
        setIsConfirmModalOpen(false);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-2xl p-6 sm:p-8"
        >
            <div className="space-y-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Confirmar Pago de Cuota
                </h2>
                {/* Resumen de pago */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Monto de cuota:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Bs. {parseFloat(montoCuota).toFixed(2)}
                        </span>
                    </div>
                    {parseFloat(moraCuota) > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Mora:</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                                Bs. {parseFloat(moraCuota).toFixed(2)}
                            </span>
                        </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-900 dark:text-white">Total a pagar:</span>
                            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                                Bs. {total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Selección de método de pago */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Seleccione el método de pago:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setSelectedMethod("QR")}
                            className={`
                                flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all
                                ${selectedMethod === "QR"
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                                }
                            `}
                        >
                            <FaQrcode className={`size-12 mb-2 ${selectedMethod === "QR" ? "text-blue-500" : "text-gray-400"}`} />
                            <span className={`font-medium ${selectedMethod === "QR" ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                                QR
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedMethod("Efectivo")}
                            className={`
                                flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all
                                ${selectedMethod === "Efectivo"
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400"
                                    : "border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                                }
                            `}
                        >
                            <FaMoneyBillWave className={`size-12 mb-2 ${selectedMethod === "Efectivo" ? "text-green-500" : "text-gray-400"}`} />
                            <span className={`font-medium ${selectedMethod === "Efectivo" ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}>
                                Efectivo
                            </span>
                        </button>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleOpenConfirmModal}
                        disabled={!selectedMethod || loading}
                    >
                        {loading ? 'Procesando...' : 'Confirmar Pago'}
                    </Button>
                </div>
            </div>

            {/* Modal de confirmación */}
            <ConfirmacionModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirm}
                title="¿Confirmar el pago de esta cuota?"
                description={`Método de pago: ${selectedMethod || ''} • Total a pagar: Bs. ${total.toFixed(2)}`}
                confirmLabel="Confirmar"
                cancelLabel="Cancelar"
                isPending={loading}
            />
        </Modal>
    );
}
