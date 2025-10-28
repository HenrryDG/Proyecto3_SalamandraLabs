import { useState } from "react";
import { useCreateCliente } from "../../../hooks/cliente/useCreateCliente";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import { Modal } from "../../ui/modal";
import { ClienteDTO } from "../../../types/cliente";
import ConfirmacionModal from "../confirmacionModal";

import {
  campos,
  camposObligatorios,
  getMaxLength,
  FormKeys
} from "../../form/configs/clienteFormConfig";
import { validarCarnetConComplemento } from "../../utils/validaciones";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateClienteModal({ isOpen, onClose, onCreated }: Props) {
  const { mutate, isPending } = useCreateCliente();

  const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState(initialForm);

  const handleInputChange = (key: FormKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Convertir complemento a mayúsculas
    if (key === "complemento") {
      value = value.toUpperCase();

      // Eliminar cualquier carácter no permitido (solo letras y números)
      value = value.replace(/[^A-Z0-9]/g, "");

      // Limitar a 2 caracteres
      if (value.length > 2) {
        value = value.slice(0, 2);
      }

      // Validar formato: primer carácter número, segundo letra
      const regex = /^[0-9][A-Z]?$/;
      if (!regex.test(value) && value !== "") {
        // Si el formato no es válido, limpiar el valor inválido
        // (por ejemplo, si empieza con letra o tiene dos números)
        const firstChar = value[0];
        const secondChar = value[1];

        if (firstChar && isNaN(Number(firstChar))) {
          // Si el primero no es número, eliminarlo
          value = value.slice(1);
        } else if (secondChar && !/[A-Z]/.test(secondChar)) {
          // Si el segundo no es letra, eliminarlo
          value = value[0];
        }
      }
    }


    // Limitar carnet según si hay complemento
    if (key === "carnet") {
      const maxCarnetLength = form.complemento ? 7 : 8;
      if (value.length > maxCarnetLength) {
        value = value.slice(0, maxCarnetLength);
      }
    }

    setForm(prev => ({ ...prev, [key]: value }));

    const campo = campos.find(c => c.key === key);

    // Para carnet, necesitamos pasar el complemento actual
    if (key === "carnet") {
      const errorCarnet = validarCarnetConComplemento(value, form.complemento);
      setErrores(prev => ({ ...prev, carnet: errorCarnet ?? "" }));
    }
    // Para complemento, necesitamos revalidar el carnet
    else if (key === "complemento") {
      const errorComplemento = campo?.validator(value) ?? "";
      const errorCarnet = validarCarnetConComplemento(form.carnet, value);
      setErrores(prev => ({
        ...prev,
        complemento: errorComplemento,
        carnet: errorCarnet ?? ""
      }));
    }
    // Apellidos: solo validar si hay valor
    else {
      setErrores(prev => ({
        ...prev,
        [key]: (key === "apellido_paterno" || key === "apellido_materno") && !value
          ? ""
          : campo?.validator(value) ?? ""
      }));
    }
  };

  // Verifica errores en tiempo real directamente desde el form
  const hayErrores =
    camposObligatorios.some(key => !form[key]) ||            // campos obligatorios
    (!form.apellido_paterno && !form.apellido_materno) ||    // al menos un apellido
    campos.some(c => c.validator(form[c.key]) !== null && c.key !== "apellido_paterno" && c.key !== "apellido_materno"); // validaciones de formato

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSaveClick = () => {
    if (hayErrores) return;
    setConfirmOpen(true);
  };

  const onConfirm = () => {
    const data: ClienteDTO = { ...form, telefono: Number(form.telefono) };

    mutate(data, {
      onSuccess: () => {
        setConfirmOpen(false);
        onClose();
        onCreated?.();
        setForm(initialForm);
        setErrores(initialForm);
      },
      onError: () => setConfirmOpen(false),
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
              digitsOnly={c.key === "telefono" || c.key === "carnet"}
              inputMode={c.key === "telefono" ? "numeric" : c.key === "ingreso_mensual" ? "decimal" : c.key === "carnet" ? "numeric" : undefined}
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
              className={c.key === "complemento" ? "sm:col-span-1" : c.key === "carnet" ? "sm:col-span-1" : ""}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSaveClick} disabled={isPending || hayErrores}>
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
      <ConfirmacionModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        title="¿Deseas registrar este nuevo cliente?"
        confirmLabel="Registrar"
        cancelLabel="Cancelar"
        isPending={isPending}
      />
    </Modal>
  );
}
