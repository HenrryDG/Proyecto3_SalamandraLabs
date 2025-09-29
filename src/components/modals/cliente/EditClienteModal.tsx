import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import { Cliente, ClienteDTO } from "../../../types/cliente";
import { useUpdateCliente } from "../../../hooks/cliente/useUpdateCliente";
import { useToggleCliente } from "../../../hooks/cliente/useToggleCliente";
import {
  validarTexto,
  validarTelefono,
  validarCarnet,
  validarCorreo,
  validarIngreso,
  validarLongitud,
  validarTextoMinimo
} from "../../utils/validaciones";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cliente: Cliente | null; // Puede llegar null si no está seleccionado
  onUpdated?: () => void;
}

type FormKeys = keyof ClienteDTO;

const campos: {
  key: FormKeys;
  label: string;
  type?: string;
  validator: (val: string) => string | null
}[] = [
    { key: "carnet", label: "Carnet", validator: (v) => validarLongitud(v, 6, 12) || validarCarnet(v) },
    { key: "nombre", label: "Nombre", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
    { key: "apellido_paterno", label: "Apellido Paterno", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
    { key: "apellido_materno", label: "Apellido Materno", validator: (v) => validarTextoMinimo(v, 3) || validarTexto(v) },
    { key: "lugar_trabajo", label: "Lugar de Trabajo", validator: (v) => validarLongitud(v, 1, 60) || validarTexto(v) },
    { key: "tipo_trabajo", label: "Ocupación", validator: (v) => validarLongitud(v, 1, 30) || validarTexto(v) },
    { key: "ingreso_mensual", label: "Ingreso Mensual", type: "number", validator: validarIngreso },
    { key: "direccion", label: "Dirección", validator: (v) => validarLongitud(v, 1, 255) },
    { key: "correo", label: "Correo", type: "email", validator: (v) => !v ? null : validarLongitud(v, 1, 50) || validarCorreo(v) },
    { key: "telefono", label: "Teléfono", validator: validarTelefono },
  ];

export default function EditClienteModal({ isOpen, onClose, cliente, onUpdated }: Props) {
  const { update, isUpdating } = useUpdateCliente();
  const { toggle, isToggling } = useToggleCliente();

  // Estado inicial con cliente o vacío
  const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState(initialForm);



  // Cargar datos del cliente al abrir modal
  useEffect(() => {
    if (cliente) {
      const formData: Record<FormKeys, string> = {
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
      };
      setForm(formData);
      setErrores(initialForm);
    }
  }, [cliente]);

  const handleInputChange = (key: FormKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [key]: value }));

    // Validar
    const campo = campos.find(c => c.key === key);
    setErrores(prev => ({ ...prev, [key]: campo?.validator(value) ?? "" }));
  };

  const camposObligatorios: FormKeys[] = campos
    .filter(c => c.key !== "correo")
    .map(c => c.key);

  const hayErrores =
    Object.values(errores).some(e => e !== "") ||
    camposObligatorios.some(key => form[key] === "");

  // Maneja el envío del formulario
  const handleSubmit = async () => {
    if (!cliente || hayErrores) return;

    // Preparar datos
    const data: Cliente = {
      ...cliente,
      ...form,
      telefono: Number(form.telefono),
      ingreso_mensual: Number(form.ingreso_mensual),
    };

    // Actualizar cliente
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
              type={c.type}
              value={form[c.key]}
              onChange={handleInputChange(c.key)}
              error={!!errores[c.key]}
              hint={errores[c.key]}
              min={c.type === "number" ? 0 : undefined}

              // Teléfono: solo dígitos y máx 8
              digitsOnly={c.key === "telefono"}
              inputMode={c.key === "telefono" ? "numeric" : undefined}

              maxLength={
                // Teléfono: máx 8
                c.key === "telefono" ? 8 :
                  // Nombres y apellidos: máx 30
                  (c.key === "nombre" || c.key === "apellido_paterno" || c.key === "apellido_materno") ? 30 :
                    undefined}

              lettersOnly={c.key === "nombre" || c.key === "apellido_paterno" || c.key === "apellido_materno"}
            />
          ))}
        </div>


        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={async () => {
              if (!cliente) return;

              await toggle(cliente.id);  // Ejecuta el toggle
              onClose();                 // Cierra el modal
              onUpdated?.();             // Refresca datos si hay callback
            }}
            disabled={isToggling}
          >
            {isToggling
              ? "Procesando..."
              : cliente?.activo
                ? "Deshabilitar"
                : "Habilitar"}
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
