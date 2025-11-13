import { useState } from "react";
import { useCreateSolicitud } from "../../../hooks/solicitud/useCreateSolicitud";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import ClienteSearchSelect from "../../form/ClienteSearchSelect";
import { Modal } from "../../ui/modal";
import { SolicitudDTO } from "../../form/configs/solicitudFormConfig";
import ConfirmacionModal from "../confirmacionModal";

import {
    campos,
    camposObligatorios,
    FormKeys
} from "../../form/configs/solicitudFormConfig";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export default function CreateSolicitudModal({ isOpen, onClose, onCreated }: Props) {
    const { mutate, isPending } = useCreateSolicitud();

    // Estado para mostrar modal de confirmación
    const [confirmOpen, setConfirmOpen] = useState(false);
    // Estado para mostrar modal con el resultado devuelto por el backend
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [resultEstado, setResultEstado] = useState<string | null>(null);

    // Estado inicial vacío
    const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;

    // Formulario y errores
    const [form, setForm] = useState(initialForm);
    const [errores, setErrores] = useState(initialForm);

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

    // Abrir modal de confirmación antes de crear
    const handleSubmit = () => {
        if (hayErrores) return;
        setConfirmOpen(true);
    };

    // Ejecuta la creación después de confirmar
    const handleConfirmCreate = () => {
        // Preparar datos (convertir números)
        const data: SolicitudDTO = {
            ...form,
            cliente: Number(form.cliente),
        };

        // Cerrar el modal de confirmación y el modal de creación, abrir el modal de resultado en modo 'procesando'
        setConfirmOpen(false);
        onClose();
        setResultEstado(null); // null = procesando
        setResultModalOpen(true);

        // Llamar a la mutación para crear la solicitud
        mutate(data, {
            onSuccess: (res) => {
                // Actualizar estado del resultado cuando llegue la respuesta
                setResultEstado(res.estado);

                // Resetear formulario
                onCreated?.();
                setForm(initialForm);
                setErrores(initialForm);
            },
            onError: (error: any) => {
                // Mostrar mensaje de error en el modal de resultado
                const mensaje =
                    error?.response?.data?.error ||
                    error?.response?.data?.mensaje ||
                    "Error al registrar solicitud";
                setResultEstado("Error: " + mensaje);
            },
        });
    };

    return (
        <>
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
                    Nueva Solicitud de Préstamo
                </h2>

                {/* Formulario de creación */}
                {/* Cliente  */}
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-4">
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
                </div>

                {/* Propósito */}
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
                        />
                    </div>
                </div>


                {/* Plazo | Monto Solicitado */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
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
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isPending || hayErrores}>
                        {isPending ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </div>
        </Modal>

        {/* Confirmación para crear */}
        <ConfirmacionModal
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={handleConfirmCreate}
            title="¿Desea crear la solicitud de crédito?"
            description="Se enviará la solicitud al sistema para su evaluación."
            confirmLabel="Guardar"
            cancelLabel="Cancelar"
            isPending={isPending}
        />

        {/* Modal de resultado: muestra si fue Aprobada, Rechazada o Pendiente */}
        <ConfirmacionModal
            isOpen={resultModalOpen}
            onClose={() => setResultModalOpen(false)}
            onConfirm={() => setResultModalOpen(false)}
            title={
                resultEstado === null
                    ? "Procesando solicitud..."
                    : resultEstado === "Aprobada"
                    ? "Solicitud Aprobada"
                    : resultEstado === "Rechazada"
                    ? "Solicitud Rechazada"
                    : (resultEstado ?? "").startsWith("Error:")
                    ? "Error"
                    : "Solicitud Pendiente"
            }
            description={
                resultEstado === null
                    ? "Por favor espere mientras se procesa la solicitud."
                    : resultEstado === "Aprobada"
                    ? "La solicitud ha sido aprobada." 
                    : resultEstado === "Rechazada"
                    ? "La solicitud ha sido rechazada." 
                    : (resultEstado ?? "").startsWith("Error:")
                    ? (resultEstado ?? "").replace("Error: ", "")
                    : "La solicitud quedó en estado Pendiente y será procesada posteriormente."
            }
            confirmLabel="Aceptar"
            cancelLabel=""
            isPending={isPending}
        />
    </>
    );
}
