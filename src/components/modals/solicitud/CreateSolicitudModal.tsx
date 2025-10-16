import { useState } from "react";
import { useCreateSolicitud } from "../../../hooks/solicitud/useCreateSolicitud";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import ClienteSearchSelect from "../../form/ClienteSearchSelect";
import { Modal } from "../../ui/modal";
import { SolicitudDTO } from "../../form/configs/solicitudFormConfig";

import {
    campos,
    camposObligatorios,
    getMaxLength,
    FormKeys
} from "../../form/configs/solicitudFormConfig";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export default function CreateSolicitudModal({ isOpen, onClose, onCreated }: Props) {
    const { mutate, isPending } = useCreateSolicitud();

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

    // Maneja el envío del formulario
    const handleSubmit = () => {
        if (hayErrores) return;

        // Preparar datos (convertir números)
        const data: SolicitudDTO = {
            ...form,
            cliente: Number(form.cliente),
            plazo_meses: Number(form.plazo_meses),
        };

        // Llamar a la mutación para crear la solicitud
        mutate(data, {
            onSuccess: () => {
                onClose();
                onCreated?.();
                setForm(initialForm);
                setErrores(initialForm);
            },
        });
    };

    return (
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

                {/* Plazo | Monto Solicitado */}
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
                    <div className="flex-1">
                        <Input
                            label="Monto Solicitado"
                            value={form.monto_solicitado}
                            onChange={handleInputChange("monto_solicitado")}
                            error={!!errores.monto_solicitado}
                            hint={errores.monto_solicitado}
                            maxLength={getMaxLength("monto_solicitado")}
                        />
                    </div>
                </div>



                {/* Propósito */}
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

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isPending || hayErrores}>
                        {isPending ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
