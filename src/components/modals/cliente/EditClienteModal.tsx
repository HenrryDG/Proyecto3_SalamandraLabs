import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import { Cliente } from "../../../types/cliente";
import { useUpdateCliente } from "../../../hooks/cliente/useUpdateCliente";
import { useToggleCliente } from "../../../hooks/cliente/useToggleCliente";
import ConfirmacionModal from "../confirmacionModal";

// Configuración de campos reutilizable
import {
  camposEdit,
  camposObligatoriosEdit,
  getMaxLengthEdit,
  EditFormKeys
} from "../../form/configs/clienteFormConfig";
import { validarCarnetConComplemento } from "../../utils/validaciones";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null;
  onUpdated?: () => void;
}

export default function EditClienteModal({ isOpen, onClose, cliente, onUpdated }: Props) {
  const { update, isUpdating } = useUpdateCliente();
  const { toggle, isToggling } = useToggleCliente();

  const initialForm = Object.fromEntries(camposEdit.map(c => [c.key, ""])) as Record<EditFormKeys, string>;
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState(initialForm);

  useEffect(() => {
    if (cliente) {
      setForm({
        carnet: cliente.carnet,
        complemento: cliente.complemento ?? "",
        nombre: cliente.nombre,
        apellido_paterno: cliente.apellido_paterno,
        apellido_materno: cliente.apellido_materno ?? "",
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

  const handleInputChange = (key: EditFormKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Complemento en mayúsculas y reglas
    if (key === "complemento") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 2);
    }

    // Validación de carnet según complemento
    if (key === "carnet") {
      const maxCarnetLength = form.complemento ? 7 : 8;
      value = value.slice(0, maxCarnetLength);
    }

    setForm(prev => ({ ...prev, [key]: value }));

    const campo = camposEdit.find(c => c.key === key);
    if (key === "carnet") {
      setErrores(prev => ({ ...prev, carnet: validarCarnetConComplemento(value, form.complemento) ?? "" }));
    } else if (key === "complemento") {
      setErrores(prev => ({
        ...prev,
        complemento: campo?.validator(value) ?? "",
        carnet: validarCarnetConComplemento(form.carnet, value) ?? ""
      }));
    } else {
      setErrores(prev => ({
        ...prev,
        [key]: campo?.validator(value) ?? ""
      }));
    }
  };

  // Verifica errores: campos obligatorios + al menos un apellido + validaciones de formato
  const hayErrores =
    camposObligatoriosEdit.some(key => !form[key]) ||
    (!form.apellido_paterno && !form.apellido_materno) ||
    camposEdit.some(c => c.validator(form[c.key]) !== null &&
      c.key !== "apellido_paterno" && c.key !== "apellido_materno");

  const handleSubmit = async () => {
    if (!cliente || hayErrores) return;

    const data: Cliente = {
      ...cliente, // esto trae id, activo, created_at, updated_at
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


  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
          Editar Cliente
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {camposEdit.map(c => (
            <Input
              key={c.key}
              label={c.label}
              type={c.type}
              value={form[c.key]}
              onChange={handleInputChange(c.key)}
              error={!!errores[c.key]}
              hint={errores[c.key]}
              min={c.type === "number" ? 0 : undefined}
              digitsOnly={c.key === "telefono" || c.key === "carnet"}
              inputMode={c.key === "telefono" ? "numeric" : c.key === "ingreso_mensual" ? "decimal" : c.key === "carnet" ? "numeric" : undefined}
              maxLength={getMaxLengthEdit(c.key)}
              lettersOnly={c.key === "nombre" || c.key === "apellido_paterno" || c.key === "apellido_materno" || c.key === "lugar_trabajo" || c.key === "tipo_trabajo"}
              decimal={c.key === "ingreso_mensual"}
              maxIntegerDigits={6}
              maxDecimalDigits={2}
              className={c.key === "complemento" || c.key === "carnet" ? "sm:col-span-1" : ""}
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
            onClick={() => setConfirmOpen(true)}
            disabled={isUpdating || hayErrores}
          >
            {isUpdating ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      <ConfirmacionModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          void handleSubmit();
        }}
        title="¿Deseas guardar los cambios realizados?"
        confirmLabel="Guardar"
        cancelLabel="Cancelar"
        isPending={isUpdating}
      />
    </Modal>
  );
}
