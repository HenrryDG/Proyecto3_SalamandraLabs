import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Select from "../../form/Select";
import { Empleado } from "../../../types/empleado";
import { roles } from "../../../shared";
import { useUpdateEmpleado } from "../../../hooks/empleado/useUpdateEmpleado";
import { useToggleEmpleado } from "../../../hooks/empleado/useToggleEmpleado";

import {
  camposEdit,
  camposObligatoriosEdit,
  getMaxLengthEdit,
  EditFormKeys
} from "../../form/configs/empleadoFormConfig";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  empleado: Empleado | null;
  onUpdated?: () => void;
}

export default function EditEmpleadoModal({ isOpen, onClose, empleado, onUpdated }: Props) {
  const { update, isUpdating } = useUpdateEmpleado();
  const { toggle, isToggling } = useToggleEmpleado();

  const initialForm = Object.fromEntries(camposEdit.map(c => [c.key, ""])) as Record<EditFormKeys, string>;
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState(initialForm);

  useEffect(() => {
    if (empleado) {
      setForm({
        nombre: empleado.nombre,
        apellido_paterno: empleado.apellido_paterno,
        apellido_materno: empleado.apellido_materno,
        correo: empleado.correo ?? "",
        telefono: String(empleado.telefono),
        rol: empleado.rol,
      });
      setErrores(initialForm);
    }
  }, [empleado]);

  const handleInputChange = (key: EditFormKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [key]: value }));

    const campo = camposEdit.find(c => c.key === key);
    setErrores(prev => ({
      ...prev,
      [key]: (key === "apellido_paterno" || key === "apellido_materno") && !value
        ? ""
        : campo?.validator(value) ?? ""
    }));
  };

  const handleSelectChange = (key: EditFormKeys) => (value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    const campo = camposEdit.find(c => c.key === key);
    setErrores(prev => ({ ...prev, [key]: campo?.validator(value) ?? "" }));
  };

  // Verifica errores: campos obligatorios + al menos un apellido + validaciones de formato
  const hayErrores =
    camposObligatoriosEdit.some(key => !form[key]) ||
    (!form.apellido_paterno && !form.apellido_materno) ||
    camposEdit.some(c => c.validator(form[c.key]) !== null && c.key !== "apellido_paterno" && c.key !== "apellido_materno");

  const handleSubmit = async () => {
    if (!empleado || hayErrores) return;

    const data: Empleado = {
      ...empleado,
      ...form,
      telefono: Number(form.telefono),
    };

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
          Editar Empleado
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {camposEdit.map(c => {
            if (c.key === "rol") {
              return (
                <div key={c.key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 mb-1">{c.label}</label>
                  <Select
                    options={roles.map(r => ({ value: String(r.value), label: r.label }))}
                    value={form.rol}
                    onChange={handleSelectChange(c.key)}
                    className={`h-11 w-full rounded-lg ${errores[c.key] ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errores[c.key] && <span className="text-xs text-red-500 mt-1">{errores[c.key]}</span>}
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
                maxLength={getMaxLengthEdit(c.key)}
                lettersOnly={c.key === "nombre" || c.key === "apellido_paterno" || c.key === "apellido_materno"}
              />
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={async () => {
              if (!empleado) return;
              await toggle(empleado.id);
              onClose();
              onUpdated?.();
            }}
            disabled={isToggling}
          >
            {isToggling ? "Procesando..." : empleado?.activo ? "Deshabilitar" : "Habilitar"}
          </Button>

          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isUpdating || hayErrores}>
            {isUpdating ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
