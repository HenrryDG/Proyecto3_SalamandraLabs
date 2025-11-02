import { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { Solicitud } from "../../../types/solicitud";
import { useCreatePrestamo } from "../../../hooks/prestamo/useCreatePrestamo";
import { useToggleSolicitud } from "../../../hooks/solicitud/useToggleSolicitud";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    solicitud: Solicitud | null;
    onUpdated?: () => void;
}

export default function AprobarSolicitudModal({ isOpen, onClose, solicitud, onUpdated }: Props) {
    const [fechaDesembolso, setFechaDesembolso] = useState<Date | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const { mutateAsync: crearPrestamo } = useCreatePrestamo();
    const { toggle, isToggling } = useToggleSolicitud();

    if (!solicitud) return null;

    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);

    const handleGuardar = async () => {
        if (!fechaDesembolso) {
            toast.error("Debe seleccionar una fecha de desembolso.");
            return;
        }

        setIsCreating(true);
        try {
            await crearPrestamo({
                solicitud: solicitud.id,
                fecha_desembolso: fechaDesembolso.toISOString().split("T")[0], // Convertir a YYYY-MM-DD
            });

            await toggle(solicitud.id, "Aprobada");

            onClose();
            onUpdated?.();
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-4">
            <div className="w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Aprobar Solicitud de Crédito
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Seleccione la fecha de desembolso para crear el préstamo.
                </p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fecha de Desembolso
                    </label>

                    <DatePicker
                        selected={fechaDesembolso}
                        onChange={(date: Date | null) => setFechaDesembolso(date)}
                        minDate={today}
                        maxDate={maxDate}
                        locale={es}
                        dateFormat="yyyy-MM-dd"
                        className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        placeholderText="Seleccione una fecha"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} size="sm">
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleGuardar}
                        size="sm"
                        disabled={isCreating || isToggling || !fechaDesembolso}
                    >
                        {isCreating ? "Creando..." : "Aprobar"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
