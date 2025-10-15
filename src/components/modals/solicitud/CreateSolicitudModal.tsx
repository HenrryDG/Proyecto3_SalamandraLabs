import { useState } from "react";
import { useCreateSolicitud } from "../../../hooks/solicitud/useCreateSolicitud";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
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

                                // MÁXIMO DE CARACTERES
                                maxLength={getMaxLength(c.key)}

                                // SOLO LETRAS
                                lettersOnly={
                                    c.key === "proposito"
                                }
                            />
                        );
                    })}
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
