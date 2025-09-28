import { useState } from "react";
import { useCreateCliente } from "../../../hooks/cliente/useCreateCliente";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import { Modal } from "../../ui/modal";
import { ClienteDTO } from "../../../types/cliente";
import { validarTexto, validarTelefono, validarCarnet, validarCorreo, validarIngreso, validarLongitud } from "../../utils/validaciones";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

type FormKeys = keyof ClienteDTO;

const campos: { key: FormKeys; label: string; type?: string; validator: (val: string) => string | null }[] = [
  { key: "carnet", label: "Carnet", validator: (v) => validarLongitud(v, 6, 12) || validarCarnet(v) },
  { key: "nombre", label: "Nombre", validator: (v) => validarLongitud(v, 1, 30) || validarTexto(v) },
  { key: "apellido_paterno", label: "Apellido Paterno", validator: (v) => validarLongitud(v, 1, 30) || validarTexto(v) },
  { key: "apellido_materno", label: "Apellido Materno", validator: (v) => validarLongitud(v, 1, 30) || validarTexto(v) },
  { key: "lugar_trabajo", label: "Lugar de Trabajo", validator: (v) => validarLongitud(v, 1, 60) || validarTexto(v) },
  { key: "tipo_trabajo", label: "Tipo de Trabajo", validator: (v) => validarLongitud(v, 1, 30) || validarTexto(v) },
  { key: "ingreso_mensual", label: "Ingreso Mensual", type: "number", validator: validarIngreso },
  { key: "direccion", label: "Dirección", validator: (v) => validarLongitud(v, 1, 255) },
  { key: "correo", label: "Correo", type: "email", validator: (v) => !v ? null : validarLongitud(v, 1, 50) || validarCorreo(v) },
  { key: "telefono", label: "Teléfono", validator: validarTelefono },
];


export default function CreateClienteModal({ isOpen, onClose, onCreated }: Props) {
  const { mutate, isPending } = useCreateCliente();

  // Estado del formulario y errores
  const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState(initialForm);


  // Maneja cambios en los campos del formulario
  const handleInputChange = (key: FormKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [key]: value }));

    // Validar el campo al cambiar
    const campo = campos.find(c => c.key === key);
    setErrores(prev => ({ ...prev, [key]: campo?.validator(value) ?? "" }));
  };

  // Campos obligatorios (excepto correo)
  const camposObligatorios: FormKeys[] = campos
    .filter(c => c.key !== "correo")
    .map(c => c.key);

  
  // Verifica si hay errores o campos obligatorios vacíos
  const hayErrores =
    Object.values(errores).some(e => e !== "") ||
    camposObligatorios.some(key => form[key] === "");

  // Maneja el envío del formulario
  const handleSubmit = () => {
    if (hayErrores) return;

    // Convertir teléfono a número
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
              type={c.type}
              value={form[c.key]}
              onChange={handleInputChange(c.key)}
              error={!!errores[c.key]}
              hint={errores[c.key]}
              min={c.type === "number" ? 0 : undefined}
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
