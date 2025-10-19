import { useState } from "react";
import { useCreateEmpleado } from "../../../hooks/empleado/useCreateEmpleado";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { Modal } from "../../ui/modal";
import { EmpleadoDTO } from "../../../types/empleado";
import { roles } from "../../../shared";

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

  // Maneja cambios en el Select
  const handleSelectChange = (key: FormKeys) => (value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
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
    const data: EmpleadoDTO = {
      ...form,
      telefono: Number(form.telefono),
    };

    // Llamar a la mutación para crear el empleado
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
                    className={`h-11 w-full rounded-lg ${errores["rol"] ? "border-red-500" : "border-gray-300"
                      }`}
                  />

                  {errores[c.key] && (
                    <span className="text-xs text-red-500 mt-1">{errores[c.key]}</span>
                  )}
                </div>
              );
            }

            if (c.key === "username") {
              return (
                <div key={c.key} className="w-full">
                  <Input
                    label={c.label}
                    type={c.type}
                    value={form[c.key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const v = e.target.value.replace(/\s/g, ""); // eliminar espacios en cualquier parte
                      handleInputChange(c.key)({ target: { value: v } } as any); // llamar tu handleInputChange
                    }}
                    error={!!errores[c.key]}
                    hint={errores[c.key]}
                    maxLength={getMaxLength(c.key)}
                  />
                </div>
              );
            }


            // Mostrar helper de requisitos para contraseña
            if (c.key === "password") {
              const pwd = form.password || "";
              const reqMinLen = pwd.length >= 8;
              const reqUpper = /[A-Z]/.test(pwd);
              const reqLower = /[a-z]/.test(pwd);
              const reqDigit = /[0-9]/.test(pwd);
              const reqSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/~`+=;:]/.test(pwd);

              return (
                <div key={c.key} className="w-full relative flex flex-col">
                  {/* Contenedor del input + icono */}
                  <div className="relative w-full">
                    <Input
                      label={c.label}
                      value={form[c.key]}
                      onChange={handleInputChange(c.key)}
                      error={!!errores[c.key]}
                      hint={errores[c.key]}
                      maxLength={getMaxLength(c.key)}
                      className="pr-10" // Padding a la derecha para que el ojo no se superponga
                    />
                  </div>

                  {/* Requisitos de la contraseña */}
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    <p className="mb-1 font-medium text-sm text-gray-700 dark:text-gray-200">
                      Requisitos de la contraseña:
                    </p>
                    <ul className="space-y-1">
                      <li className={`${reqMinLen ? "text-success-500" : "text-gray-400"}`}>
                        <span className="inline-block w-4">{reqMinLen ? "✓" : "•"}</span>
                        Mínimo 8 caracteres
                      </li>
                      <li className={`${reqUpper ? "text-success-500" : "text-gray-400"}`}>
                        <span className="inline-block w-4">{reqUpper ? "✓" : "•"}</span>
                        Al menos una letra mayúscula
                      </li>
                      <li className={`${reqLower ? "text-success-500" : "text-gray-400"}`}>
                        <span className="inline-block w-4">{reqLower ? "✓" : "•"}</span>
                        Al menos una letra minúscula
                      </li>
                      <li className={`${reqDigit ? "text-success-500" : "text-gray-400"}`}>
                        <span className="inline-block w-4">{reqDigit ? "✓" : "•"}</span>
                        Al menos un número
                      </li>
                      <li className={`${reqSpecial ? "text-success-500" : "text-gray-400"}`}>
                        <span className="inline-block w-4">{reqSpecial ? "✓" : "•"}</span>
                        Al menos un carácter especial (ej. !@#$%)
                      </li>
                    </ul>
                  </div>
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
                lettersOnly={
                  c.key === "nombre" ||
                  c.key === "apellido_paterno" ||
                  c.key === "apellido_materno"
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
