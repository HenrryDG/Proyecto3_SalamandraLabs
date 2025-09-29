import { useState } from "react";
import { useCreateCliente } from "../../../hooks/cliente/useCreateCliente";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import { Modal } from "../../ui/modal";
import { ClienteDTO } from "../../../types/cliente";

import {
  campos,
  camposObligatorios,
  getMaxLength,
  FormKeys
} from "../../form/configs/clienteFormConfig";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateClienteModal({ isOpen, onClose, onCreated }: Props) {
  const { mutate, isPending } = useCreateCliente();

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

    // Preparar datos (convertir teléfono a número)
    const data: ClienteDTO = { ...form, telefono: Number(form.telefono) };

    // Llamar a la mutación para crear el cliente
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
          Registrar Cliente
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {campos.map(c => (
            <Input
              key={c.key}
              label={c.label}
              type={c.key === "ingreso_mensual" ? "text" : c.type}
              value={form[c.key]}
              onChange={handleInputChange(c.key)}
              error={!!errores[c.key]}
              hint={errores[c.key]}
              min={c.type === "number" ? 0 : undefined}

              digitsOnly={c.key === "telefono"}
              inputMode={c.key === "telefono" ? "numeric" : c.key === "ingreso_mensual" ? "decimal" : undefined}

              maxLength={getMaxLength(c.key)}

              lettersOnly={
                c.key === "nombre" ||
                c.key === "apellido_paterno" ||
                c.key === "apellido_materno" ||
                c.key === "lugar_trabajo" ||
                c.key === "tipo_trabajo"}
              decimal={c.key === "ingreso_mensual"}
              maxIntegerDigits={6}
              maxDecimalDigits={2}
            />
          ))}
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
