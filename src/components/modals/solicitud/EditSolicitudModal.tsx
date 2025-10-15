import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Input from "../../form/input/InputField";
import ClienteSearchSelect from "../../form/ClienteSearchSelect";
import Button from "../../ui/button/Button";
import { Solicitud } from "../../../types/solicitud";
import { useUpdateSolicitud } from "../../../hooks/solicitud/useUpdateSolicitud";
import { useToggleSolicitud } from "../../../hooks/solicitud/useToggleSolicitud";

// Configuración de campos reutilizable
import {
    campos,
    camposObligatorios,
    getMaxLength,
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
    const { toggle, isToggling } = useToggleSolicitud();

    // Estado inicial vacío
    const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;

    // Formulario y errores
    const [form, setForm] = useState(initialForm);
    const [errores, setErrores] = useState(initialForm);

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

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
                    Editar Solicitud de Préstamo
                </h2>

                {/* Campo de empleado (solo lectura) */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Empleado
                    </label>
                    <input
                        type="text"
                        value={solicitud?.empleado_nombre || ""}
                        disabled
                        className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                    />
                </div>

                {/* Formulario de edición */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {campos.map(c => {
                        // Campo especial para cliente
                        if (c.key === "cliente") {
                            return (
                                <div key={c.key} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {c.label}
                                    </label>
                                    <ClienteSearchSelect
                                        value={form[c.key]}
                                        onChange={(value) => {
                                            setForm(prev => ({ ...prev, [c.key]: value }));
                                            setErrores(prev => ({ ...prev, [c.key]: "" }));
                                        }}
                                        placeholder="Buscar cliente..."
                                        error={!!errores[c.key]}
                                        hint={errores[c.key]}
                                    />
                                </div>
                            );
                        }

                        // Campos normales
                        return (
                            <Input
                                key={c.key}
                                label={c.label}
                                type={c.type}
                                value={form[c.key]}
                                onChange={handleInputChange(c.key)}
                                error={!!errores[c.key]}
                                hint={errores[c.key]}
                                min={c.type === "number" ? 0 : undefined}

                                // SOLO DÍGITOS
                                digitsOnly={c.key === "plazo_meses"}
                                inputMode={c.key === "plazo_meses" ? "numeric" : undefined}

                                // CANTIDAD MÁXIMA DE CARACTERES
                                maxLength={getMaxLength(c.key)}

                                // SOLO LETRAS
                                lettersOnly={
                                    c.key === "proposito"
                                }
                            />
                        );
                    })}
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-3 pt-4">
                    {/* Cambiar Estado */}
                    <Button
                        onClick={async () => {
                            if (!solicitud) return;

                            await toggle(solicitud.id);
                            onClose();
                            onUpdated?.();
                        }}
                        disabled={isToggling}
                    >
                        {isToggling
                            ? "Procesando..."
                            : solicitud?.estado === "Aprobada"
                                ? "Rechazar"
                                : solicitud?.estado === "Rechazada"
                                    ? "Aprobar"
                                    : "Cambiar Estado"}
                    </Button>

                    {/* Cancelar y Guardar */}
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isUpdating || hayErrores}
                    >
                        {isUpdating ? "Actualizando..." : "Guardar Cambios"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
