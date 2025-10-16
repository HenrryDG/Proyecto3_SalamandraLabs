import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import Radio from "../../form/input/Radio";
import ClienteSearchSelect from "../../form/ClienteSearchSelect";
import Button from "../../ui/button/Button";
import { Solicitud } from "../../../types/solicitud";
import { useUpdateSolicitud } from "../../../hooks/solicitud/useUpdateSolicitud";
import { useEmpleado } from "../../../hooks/empleado/useEmpleado";

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
    const { empleado } = useEmpleado();

    // Estado inicial vacío
    const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;

    // Formulario y errores
    const [form, setForm] = useState(initialForm);
    const [errores, setErrores] = useState(initialForm);
    const [estado, setEstado] = useState<string>("Pendiente");

    // Verificar si el usuario es administrador
    const esAdministrador = empleado?.rol === "Administrador";

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
            setEstado(solicitud.estado);
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
            estado: estado,
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

                {/* Campo de empleado - Solo visible para administradores */}
                {esAdministrador && (
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
                )}

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
                        />
                    </div>
                    <Input
                        label="Monto Solicitado"
                        value={form.monto_solicitado}
                        onChange={handleInputChange("monto_solicitado")}
                        error={!!errores.monto_solicitado}
                        hint={errores.monto_solicitado}
                        maxLength={getMaxLength("monto_solicitado")}
                    />
                </div>

                {/* Proposito | Plazo */}
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-4">
                    <Input
                        label="Propósito"
                        value={form.proposito}
                        onChange={handleInputChange("proposito")}
                        error={!!errores.proposito}
                        hint={errores.proposito}
                        maxLength={getMaxLength("proposito")}
                        lettersOnly={true}
                    />

                </div>

                {/* Fecha de Solicitud | Fecha de Aprobación */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <Input
                            label="Plazo (meses)"
                            type="number"
                            value={form.plazo_meses}
                            onChange={handleInputChange("plazo_meses")}
                            error={!!errores.plazo_meses}
                            hint={errores.plazo_meses}
                            min={0}
                            digitsOnly={true}
                            inputMode="numeric"
                            maxLength={getMaxLength("plazo_meses")}
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
                            value={solicitud?.fecha_aprobacion || "No aprobada"}
                            disabled
                            className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>

                </div>

                {/* Observaciones */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Observaciones
                    </label>
                    <TextArea
                        value={form.observaciones}
                        onChange={(value) => {
                            setForm(prev => ({ ...prev, observaciones: value }));
                            setErrores(prev => ({ ...prev, observaciones: "" }));
                        }}
                        rows={2}
                        error={!!errores.observaciones}
                        hint={errores.observaciones}
                        placeholder="Escriba las observaciones aquí..."
                    />
                </div>

                {/* Estado */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Estado de la Solicitud
                    </label>
                    <div className="flex flex-wrap items-center gap-6">
                        <Radio
                            id="estado-pendiente"
                            name="estado"
                            value="Pendiente"
                            checked={estado === "Pendiente"}
                            onChange={(value) => setEstado(value)}
                            label="Pendiente"
                        />
                        <Radio
                            id="estado-aprobada"
                            name="estado"
                            value="Aprobada"
                            checked={estado === "Aprobada"}
                            onChange={(value) => setEstado(value)}
                            label="Aprobada"
                        />
                        <Radio
                            id="estado-rechazada"
                            name="estado"
                            value="Rechazada"
                            checked={estado === "Rechazada"}
                            onChange={(value) => setEstado(value)}
                            label="Rechazada"
                        />
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-3 pt-4">
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
