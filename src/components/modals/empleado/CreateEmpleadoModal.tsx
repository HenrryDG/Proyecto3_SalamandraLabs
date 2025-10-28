import { useState } from "react";
import { useCreateEmpleado } from "../../../hooks/empleado/useCreateEmpleado";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { Modal } from "../../ui/modal";
import { EmpleadoDTO } from "../../../types/empleado";
import { roles } from "../../../shared";
import ConfirmacionModal from "../confirmacionModal";

import {
  campos,
  camposObligatorios,
  getMaxLength,
  FormKeys
} from "../../form/configs/empleadoFormConfig";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateEmpleadoModal({ isOpen, onClose, onCreated }: Props) {
  const { mutate, isPending } = useCreateEmpleado();

  const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState(initialForm);

  // Maneja cambios en inputs
  // Maneja cambios en inputs
  const handleInputChange = (key: FormKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Evitar espacios en usuario y contraseña
    if (key === "username" || key === "password") {
      value = value.replace(/\s/g, "");
    }

    setForm(prev => ({ ...prev, [key]: value }));

    const campo = campos.find(c => c.key === key);
    setErrores(prev => ({
      ...prev,
      [key]: (key === "apellido_paterno" || key === "apellido_materno") && !value
        ? ""
        : campo?.validator(value) ?? ""
    }));
  };


  // Maneja cambios en select
  const handleSelectChange = (key: FormKeys) => (value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    const campo = campos.find(c => c.key === key);
    setErrores(prev => ({ ...prev, [key]: campo?.validator(value) ?? "" }));
  };

  // Verifica errores: campos obligatorios + al menos un apellido + validaciones de formato
  const hayErrores =
    camposObligatorios.some(key => !form[key]) ||
    (!form.apellido_paterno && !form.apellido_materno) ||
    campos.some(c => c.validator(form[c.key]) !== null && c.key !== "apellido_paterno" && c.key !== "apellido_materno");

  

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSaveClick = () => {
    if (hayErrores) return;
    setConfirmOpen(true);
  };

  const onConfirm = () => {
    const data: EmpleadoDTO = { ...form, telefono: Number(form.telefono) };

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
          Registrar Empleado
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {campos.map(c => {
            if (c.key === "rol") {
              return (
                <div key={c.key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 mb-1">
                    {c.label}
                  </label>
                  <Select
                    options={roles.map(r => ({ value: String(r.value), label: r.label }))}
                    defaultValue={form.rol}
                    onChange={handleSelectChange("rol")}
                    className={`h-11 w-full rounded-lg ${errores["rol"] ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errores[c.key] && (
                    <span className="text-xs text-red-500 mt-1">{errores[c.key]}</span>
                  )}
                </div>
              );
            }

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
                digitsOnly={c.key === "telefono"}
                inputMode={c.key === "telefono" ? "numeric" : undefined}
                maxLength={getMaxLength(c.key)}
                lettersOnly={c.key === "nombre" || c.key === "apellido_paterno" || c.key === "apellido_materno"}
              />
            );
          })}
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
        title="¿Deseas registrar este nuevo empleado?"
        confirmLabel="Registrar"
        cancelLabel="Cancelar"
        isPending={isPending}
      />
    </Modal>
  );
}
