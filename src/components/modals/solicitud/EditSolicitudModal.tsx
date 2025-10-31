import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import TextArea from "../../form/input/TextArea";
import Button from "../../ui/button/Button";
import { Solicitud } from "../../../types/solicitud";
import { Documento } from "../../../types/documento";
import { useUpdateSolicitud } from "../../../hooks/solicitud/useUpdateSolicitud";
import { useToggleSolicitud } from "../../../hooks/solicitud/useToggleSolicitud";
import { useDeleteSolicitud } from "../../../hooks/solicitud/useDeleteSolicitud";
import { getDocumentos } from "../../../services/documento/documentoService";
import ConfirmacionModal from "../confirmacionModal";
import { TrashBinIcon } from "../../../icons";

// Configuración de campos reutilizable
import {
    campos,
    camposObligatorios,
    FormKeys
} from "../../form/configs/solicitudFormConfig";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    solicitud: Solicitud | null;   // Solicitud a editar (puede ser null)
    onUpdated?: () => void;      // Callback después de actualizar
}

export default function EditSolicitudModal({ isOpen, onClose, solicitud, onUpdated }: Props) {
    const { update, isUpdating } = useUpdateSolicitud();
    const { toggle, isToggling } = useToggleSolicitud();
    const { deleteSol, isDeleting } = useDeleteSolicitud();


    // Estado inicial vacío
    const initialForm = Object.fromEntries(campos.map(c => [c.key, ""])) as Record<FormKeys, string>;

    // Formulario y errores
    const [form, setForm] = useState(initialForm);
    const [errores, setErrores] = useState(initialForm);
    // Estado para documentos
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    // Estado para mostrar confirmación antes de actualizar
    const [confirmOpen, setConfirmOpen] = useState(false);
    // Estados para confirmar aprobar/rechazar
    const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
    const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
    // Estado para confirmar eliminación
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);


    // Cargar datos de la solicitud al abrir el modal
    useEffect(() => {
        if (solicitud) {
            const formData: Record<FormKeys, string> = {
                cliente: String(solicitud.cliente),
                monto_solicitado: solicitud.monto_solicitado,
                proposito: solicitud.proposito,
                observaciones: solicitud.observaciones ?? "",
            };

            setForm(formData);
            setErrores(initialForm);
            
            // Cargar documentos de la solicitud
            const fetchDocumentos = async () => {
                try {
                    const docs = await getDocumentos(solicitud.id);
                    setDocumentos(docs);
                } catch (error) {
                    setDocumentos([]);
                }
            };
            fetchDocumentos();
        }
    }, [solicitud]);


    // Verificar si todos los documentos requeridos están subidos y verificados
    const todosLosDocumentosValidados = () => {
        if (!solicitud) return false;
        
        // Verificar que existe la fotocopia de carnet y está verificada
        const tieneCarnet = documentos.some(
            doc => doc.tipo_documento === "Fotocopia de carnet" && doc.verificado
        );
        
        // Verificar que existe al menos una factura verificada
        const tieneFactura = documentos.some(
            doc => ["Factura de luz", "Factura de gas", "Factura de agua"].includes(doc.tipo_documento) && doc.verificado
        );
        
        return tieneCarnet && tieneFactura;
    };

    // Verifica si hay errores en el formulario
    const hayErrores =
        Object.values(errores).some(e => e !== "") ||
        camposObligatorios.some(key => form[key] === "");

    // Abrir modal de confirmación antes de ejecutar la actualización
    const handleSubmit = () => {
        if (!solicitud || hayErrores) return;
        setConfirmOpen(true);
    };

    // Ejecuta la actualización después de confirmar
    const handleConfirmUpdate = async () => {
        if (!solicitud) return;

        // Preparar datos actualizados
        const data: Solicitud = {
            ...solicitud,
            cliente: Number(form.cliente),
            monto_solicitado: form.monto_solicitado,
            proposito: form.proposito,
            observaciones: form.observaciones || null,
        };

        // Ejecutar actualización
        const updated = await update(data);
        if (updated) {
            setConfirmOpen(false);
            onClose();
            onUpdated?.();
        } else {
            setConfirmOpen(false);
        }
    };

    // Maneja el cambio de estado de la solicitud (uso interno)
    const handleCambiarEstado = async (nuevoEstado: "Aprobada" | "Rechazada") => {
        if (!solicitud) return false;

        const ok = await toggle(solicitud.id, nuevoEstado);
        if (ok) {
            onClose();
            onUpdated?.();
            return true;
        }
        return false;
    };

    // Confirmaciones específicas para aprobar/rechazar usando el modal
    const handleConfirmApprove = async () => {
        if (!solicitud) return;
        // Mantener el modal abierto mientras isToggling === true (isPending)
        const ok = await handleCambiarEstado("Aprobada");
        setApproveConfirmOpen(false);
        return ok;
    };

    const handleConfirmReject = async () => {
        if (!solicitud) return;
        const ok = await handleCambiarEstado("Rechazada");
        setRejectConfirmOpen(false);
        return ok;
    };

    // Confirmación para eliminar la solicitud
    const handleConfirmDelete = async () => {
        if (!solicitud) return;
        const ok = await deleteSol(solicitud.id);
        if (ok) {
            setDeleteConfirmOpen(false);
            onClose();
            onUpdated?.();
            return true;
        }
        setDeleteConfirmOpen(false);
        return false;
    };

    // Determinar si la solicitud está rechazada
    const isRechazada = solicitud?.estado === "Rechazada";
    const isAprobada = solicitud?.estado === "Aprobada";

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
                    {isRechazada ? "Solicitud Rechazada" : isAprobada ? "Solicitud Aprobada" : "Editar Solicitud de Préstamo"}

                </h2>

                {/* Formulario de edición */}
                {/* Cliente | Monto Solicitado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cliente
                        </label>
                        <input
                            type="text"
                            value={solicitud?.cliente_nombre || ""}
                            disabled
                            className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Monto Solicitado
                        </label>
                        <input
                            type="text"
                            value={form.monto_solicitado}
                            disabled
                            className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Proposito */}
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Propósito
                        </label>
                        <TextArea
                            value={form.proposito}
                            onChange={(value) => {
                                setForm(prev => ({ ...prev, proposito: value }));
                                const campo = campos.find(c => c.key === "proposito");
                                setErrores(prev => ({ ...prev, proposito: campo?.validator(value) ?? "" }));
                            }}
                            rows={2}
                            error={!!errores.proposito}
                            hint={errores.proposito}
                            placeholder="Escriba el propósito del préstamo..."
                            lettersOnly={true}
                            maxLength={500}
                            disabled={isRechazada || isAprobada}
                        />
                    </div>
                </div>

                {/* Fecha de Solicitud | Fecha de Aprobación */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1 space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fecha de Solicitud
                        </label>
                        <input
                            type="text"
                            value={solicitud?.fecha_solicitud || ""}
                            disabled
                            className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fecha de Resolución
                        </label>
                        <input
                            type="text"
                            value={solicitud?.fecha_aprobacion || "Sin resolver"}
                            disabled
                            className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>

                </div>

                {/* Observaciones */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Observaciones (Opcional)
                    </label>
                    <TextArea
                        value={form.observaciones}
                        onChange={(value) => {
                            setForm(prev => ({ ...prev, observaciones: value }));
                            const campo = campos.find(c => c.key === "observaciones");
                            setErrores(prev => ({ ...prev, observaciones: campo?.validator(value) ?? "" }));
                        }}
                        rows={3}
                        error={!!errores.observaciones}
                        hint={errores.observaciones}
                        placeholder="Escriba las observaciones aquí..."
                        lettersOnly={true}
                        maxLength={500}
                        disabled={isRechazada || isAprobada}
                    />
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
                    {solicitud?.estado === "Pendiente" && (
                        <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-row sm:w-auto">
                            <div className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteConfirmOpen(true)}
                                    disabled={isDeleting || isToggling}
                                    title="Eliminar solicitud"
                                    className="!w-11 !px-0"
                                >
                                    <TrashBinIcon className="size-5 text-red-500" />
                                </Button>
                            </div>
                            {todosLosDocumentosValidados() && (
                                <>
                                    <div className="w-full sm:w-auto">
                                        <Button
                                            variant="success"
                                            onClick={() => setApproveConfirmOpen(true)}
                                            disabled={isToggling || isDeleting}
                                            className="w-full"
                                        >
                                            {isToggling ? "Procesando..." : "Aprobar"}
                                        </Button>
                                    </div>
                                    <div className="w-full sm:w-auto">
                                        <Button
                                            variant="error"
                                            onClick={() => setRejectConfirmOpen(true)}
                                            disabled={isToggling || isDeleting}
                                            className="w-full"
                                        >
                                            {isToggling ? "Procesando..." : "Rechazar"}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-row sm:w-auto">
                        <div className="w-full sm:w-auto">
                            <Button variant="outline" onClick={onClose} className="w-full">
                                {isRechazada ? "Cerrar" : isAprobada ? "Cerrar" : "Cancelar"}
                            </Button>
                        </div>
                        {!isRechazada && !isAprobada && (
                            <div className="w-full sm:w-auto">
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={isUpdating || hayErrores || isToggling || isDeleting}
                                    className="w-full"
                                >
                                    {isUpdating ? "Actualizando..." : "Guardar"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <ConfirmacionModal
                    isOpen={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={handleConfirmUpdate}
                    isPending={isUpdating}
                />
                {/* Confirmación para aprobar */}
                <ConfirmacionModal
                    isOpen={approveConfirmOpen}
                    onClose={() => setApproveConfirmOpen(false)}
                    onConfirm={handleConfirmApprove}
                    title="¿Desea aprobar la solicitud de crédito?"
                    description={"Esta acción cambiará el estado de la solicitud a Aprobada."}
                    confirmLabel="Aprobar"
                    cancelLabel="Cancelar"
                    isPending={isToggling}
                />

                {/* Confirmación para rechazar */}
                <ConfirmacionModal
                    isOpen={rejectConfirmOpen}
                    onClose={() => setRejectConfirmOpen(false)}
                    onConfirm={handleConfirmReject}
                    title="¿Desea rechazar la solicitud de crédito?"
                    description={"Esta acción cambiará el estado de la solicitud a Rechazada."}
                    confirmLabel="Rechazar"
                    cancelLabel="Cancelar"
                    isPending={isToggling}
                />

                {/* Confirmación para eliminar */}
                <ConfirmacionModal
                    isOpen={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="¿Desea eliminar la solicitud de crédito?"
                    description={"Esta acción eliminará permanentemente la solicitud y todos sus documentos asociados."}
                    confirmLabel="Eliminar"
                    cancelLabel="Cancelar"
                    isPending={isDeleting}
                />
            </div>
        </Modal>
    );
}