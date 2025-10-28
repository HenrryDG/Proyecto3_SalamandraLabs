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
  campos,
  camposObligatorios,
  getMaxLength,
  FormKeys
} from "../../form/configs/clienteFormConfig";
import { validarCarnetConComplemento } from "../../utils/validaciones";

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
        complemento: cliente.complemento ?? "",
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
    let value = e.target.value;

    // Convertir complemento a mayúsculas
    if (key === "complemento") {
      value = value.toUpperCase();

      // Validar restricciones de complemento en tiempo real
      const numCount = (value.match(/\d/g) || []).length;
      const letterCount = (value.match(/[A-Z]/g) || []).length;
      const hasSpecial = /[^A-Z0-9]/.test(value);

      // Si hay caracteres especiales, eliminarlos
      if (hasSpecial) {
        value = value.replace(/[^A-Z0-9]/g, "");
      }

      // Si ya hay un número y se intenta agregar otro, no permitir
      if (numCount > 1) {
        value = value.replace(/\d/g, (match, offset) => {
          return offset === value.indexOf(value.match(/\d/)![0]) ? match : "";
        });
      }

      // Si ya hay una letra y se intenta agregar otra, no permitir
      if (letterCount > 1) {
        value = value.replace(/[A-Z]/g, (match, offset) => {
          return offset === value.indexOf(value.match(/[A-Z]/)![0]) ? match : "";
        });
      }

      // Limitar a 2 caracteres
      if (value.length > 2) {
        value = value.slice(0, 2);
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
      // Convertir a mayúsculas
      value = value.toUpperCase();

      // Permitir solo letras y números
      value = value.replace(/[^A-Z0-9]/g, "");

      // Limitar a 2 caracteres
      if (value.length > 2) {
        value = value.slice(0, 2);
      }

      // Validar formato número + letra (en ese orden)
      const regex = /^[0-9][A-Z]?$/;
      if (!regex.test(value) && value !== "") {
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

      // Luego, ejecutar las validaciones normales
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

  const [confirmOpen, setConfirmOpen] = useState(false);

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
              digitsOnly={c.key === "telefono" || c.key === "carnet"}
              inputMode={c.key === "telefono" ? "numeric" : c.key === "ingreso_mensual" ? "decimal" : c.key === "carnet" ? "numeric" : undefined}
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
              className={c.key === "complemento" ? "sm:col-span-1" : c.key === "carnet" ? "sm:col-span-1" : ""}
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
