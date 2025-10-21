import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import { Cliente } from "../../../types/cliente";
import { useUpdateCliente } from "../../../hooks/cliente/useUpdateCliente";
import { useToggleCliente } from "../../../hooks/cliente/useToggleCliente";

// Configuración de campos reutilizable
import {
  campos,
  camposObligatorios,
  getMaxLength,
  FormKeys
} from "../../form/configs/clienteFormConfig";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;   // Cliente a editar (puede ser null)
  onUpdated?: () => void;    // Callback después de actualizar
}

// ...imports iguales

export default function EditClienteModal({ isOpen, onClose, cliente, onUpdated }: Props) {
  const { update, isUpdating } = useUpdateCliente();
  const { toggle, isToggling } = useToggleCliente();

  const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState(initialForm);

  useEffect(() => {
    if (cliente) {
      setForm({
        carnet: cliente.carnet,
        nombre: cliente.nombre,
        apellido_paterno: cliente.apellido_paterno,
        apellido_materno: cliente.apellido_materno,
        lugar_trabajo: cliente.lugar_trabajo,
        tipo_trabajo: cliente.tipo_trabajo,
        ingreso_mensual: String(cliente.ingreso_mensual),
        direccion: cliente.direccion,
        correo: cliente.correo ?? "",
        telefono: String(cliente.telefono),
      });
      setErrores(initialForm);
    }
  }, [cliente]);

  const handleInputChange = (key: FormKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [key]: value }));

    const campo = campos.find(c => c.key === key);
    setErrores(prev => ({
      ...prev,
      [key]: (key === "apellido_paterno" || key === "apellido_materno") && !value
        ? ""
        : campo?.validator(value) ?? ""
    }));
  };

  const hayErrores =
    camposObligatorios.some(key => !form[key]) ||                  // Campos obligatorios
    (!form.apellido_paterno && !form.apellido_materno) ||          // Al menos un apellido
    campos.some(c => c.validator(form[c.key]) !== null &&
                   c.key !== "apellido_paterno" &&
                   c.key !== "apellido_materno");                 // Validaciones de formato

  const handleSubmit = async () => {
    if (!cliente || hayErrores) return;

    const data: Cliente = {
      ...cliente,
      ...form,
      telefono: Number(form.telefono),
      ingreso_mensual: Number(form.ingreso_mensual),
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
          Editar Cliente
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
                c.key === "tipo_trabajo"
              }
              decimal={c.key === "ingreso_mensual"}
              maxIntegerDigits={6}
              maxDecimalDigits={2}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={async () => {
              if (!cliente) return;
              await toggle(cliente.id);
              onClose();
              onUpdated?.();
            }}
            disabled={isToggling}
          >
            {isToggling ? "Procesando..." : cliente?.activo ? "Deshabilitar" : "Habilitar"}
          </Button>

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
