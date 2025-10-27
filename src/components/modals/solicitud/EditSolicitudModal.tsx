import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import ClienteSearchSelect from "../../form/ClienteSearchSelect";
import Button from "../../ui/button/Button";
import { Solicitud } from "../../../types/solicitud";
import { useUpdateSolicitud } from "../../../hooks/solicitud/useUpdateSolicitud";
import { useToggleSolicitud } from "../../../hooks/solicitud/useToggleSolicitud";

// Configuración de campos reutilizable
import {
    campos,
    camposObligatorios,
    FormKeys
} from "../../form/configs/solicitudFormConfig";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    solicitud: Solicitud | null;   // Solicitud a editar (puede ser null)
    onUpdated?: () => void;      // Callback después de actualizar
}

export default function EditSolicitudModal({ isOpen, onClose, solicitud, onUpdated }: Props) {
    const { update, isUpdating } = useUpdateSolicitud();


    // Estado inicial vacío
    const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;

    // Formulario y errores
    const [form, setForm] = useState(initialForm);
    const [errores, setErrores] = useState(initialForm);
    const { toggle, isToggling } = useToggleSolicitud();


    // Cargar datos de la solicitud al abrir el modal
    useEffect(() => {
        if (solicitud) {
            const formData: Record<FormKeys, string> = {
                cliente: String(solicitud.cliente),
                monto_solicitado: solicitud.monto_solicitado,
                proposito: solicitud.proposito,
                plazo_meses: String(solicitud.plazo_meses),
                observaciones: solicitud.observaciones ?? "",
            };

            setForm(formData);
            setErrores(initialForm);
        }
    }, [solicitud]);

    // Maneja cambios en los campos del formulario
    const handleInputChange = (key: FormKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm(prev => ({ ...prev, [key]: value }));

        // Validar el campo y actualizar errores
        const campo = campos.find(c => c.key === key);
        setErrores(prev => ({ ...prev, [key]: campo?.validator(value) ?? "" }));
    };

    // Verifica si hay errores en el formulario
    const hayErrores =
        Object.values(errores).some(e => e !== "") ||
        camposObligatorios.some(key => form[key] === "");

    // Maneja el envío del formulario
    const handleSubmit = async () => {
        if (!solicitud || hayErrores) return;

        // Preparar datos actualizados
        const data: Solicitud = {
            ...solicitud,
            cliente: Number(form.cliente),
            monto_solicitado: form.monto_solicitado,
            proposito: form.proposito,
            plazo_meses: Number(form.plazo_meses),
            observaciones: form.observaciones || null,
        };

        // Ejecutar actualización
        const updated = await update(data);
        if (updated) {
            onClose();
            onUpdated?.();
        }
    };

    // Maneja el cambio de estado de la solicitud
    const handleCambiarEstado = async (nuevoEstado: "Aprobada" | "Rechazada") => {
        if (!solicitud) return;

        const ok = await toggle(solicitud.id, nuevoEstado);
        if (ok) {
            onClose();
            onUpdated?.();
        }
    };

    // Determinar si la solicitud está rechazada
    const isRechazada = solicitud?.estado === "Rechazada";

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
                    {isRechazada ? "Solicitud Rechazada" : "Editar Solicitud de Préstamo"}
                </h2>

                {/* Formulario de edición */}
                {/* Cliente | Monto Solicitado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cliente
                        </label>
                        <ClienteSearchSelect
                            value={form.cliente}
                            onChange={(value) => {
                                setForm(prev => ({ ...prev, cliente: value }));
                                setErrores(prev => ({ ...prev, cliente: "" }));
                            }}
                            placeholder="Buscar cliente..."
                            error={!!errores.cliente}
                            hint={errores.cliente}
                            disabled={isRechazada}
                        />
                    </div>
                    <Input
                        label="Monto Solicitado"
                        type="text"
                        value={form.monto_solicitado}
                        onChange={handleInputChange("monto_solicitado")}
                        error={!!errores.monto_solicitado}
                        hint={errores.monto_solicitado}
                        inputMode="decimal"
                        decimal={true}
                        maxIntegerDigits={6}
                        maxDecimalDigits={2}
                        placeholder="0.00"
                        disabled={isRechazada}
                    />
                </div>

                {/* Proposito */}
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Propósito
                        </label>
                        <TextArea
                            value={form.proposito}
                            onChange={(value) => {
                                setForm(prev => ({ ...prev, proposito: value }));
                                const campo = campos.find(c => c.key === "proposito");
                                setErrores(prev => ({ ...prev, proposito: campo?.validator(value) ?? "" }));
                            }}
                            rows={2}
                            error={!!errores.proposito}
                            hint={errores.proposito}
                            placeholder="Escriba el propósito del préstamo..."
                            lettersOnly={true}
                            maxLength={500}
                            disabled={isRechazada}
                        />
                    </div>
                </div>

                {/* Fecha de Solicitud | Fecha de Aprobación */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <Input
                            label="Plazo (meses)"
                            type="text"
                            value={form.plazo_meses}
                            onChange={handleInputChange("plazo_meses")}
                            error={!!errores.plazo_meses}
                            hint={errores.plazo_meses}
                            inputMode="numeric"
                            digitsOnly={true}
                            maxLength={2}
                            placeholder="0"
                            disabled={isRechazada}
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fecha de Solicitud
                        </label>
                        <input
                            type="text"
                            value={solicitud?.fecha_solicitud || ""}
                            disabled
                            className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fecha de Resolución
                        </label>
                        <input
                            type="text"
                            value={solicitud?.fecha_aprobacion || "Sin resolver"}
                            disabled
                            className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>

                </div>

                {/* Observaciones */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Observaciones (Opcional)
                    </label>
                    <TextArea
                        value={form.observaciones}
                        onChange={(value) => {
                            setForm(prev => ({ ...prev, observaciones: value }));
                            const campo = campos.find(c => c.key === "observaciones");
                            setErrores(prev => ({ ...prev, observaciones: campo?.validator(value) ?? "" }));
                        }}
                        rows={3}
                        error={!!errores.observaciones}
                        hint={errores.observaciones}
                        placeholder="Escriba las observaciones aquí..."
                        lettersOnly={true}
                        maxLength={500}
                        disabled={isRechazada}
                    />
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
                    {solicitud?.estado === "Pendiente" && (
                        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-row sm:w-auto">
                            <div className="w-full sm:w-auto">
                                <Button
                                    variant="success"
                                    onClick={() => handleCambiarEstado("Aprobada")}
                                    disabled={isToggling}
                                    className="w-full"
                                >
                                    {isToggling ? "Procesando..." : "Aprobar"}
                                </Button>
                            </div>
                            <div className="w-full sm:w-auto">
                                <Button
                                    variant="error"
                                    onClick={() => handleCambiarEstado("Rechazada")}
                                    disabled={isToggling}
                                    className="w-full"
                                >
                                    {isToggling ? "Procesando..." : "Rechazar"}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-row sm:w-auto">
                        <div className="w-full sm:w-auto">
                            <Button variant="outline" onClick={onClose} className="w-full">
                                {isRechazada ? "Cerrar" : "Cancelar"}
                            </Button>
                        </div>
                        {!isRechazada && (
                            <div className="w-full sm:w-auto">
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={isUpdating || hayErrores || isToggling}
                                    className="w-full"
                                >
                                    {isUpdating ? "Actualizando..." : "Guardar Cambios"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
