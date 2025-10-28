import React from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

interface ConfirmacionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	isPending?: boolean;
}

const ConfirmacionModal: React.FC<ConfirmacionModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title = "¿Deseas guardar los cambios realizados?",
	description,
	confirmLabel = "Guardar",
	cancelLabel = "Cancelar",
	isPending = false,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-4" showCloseButton={false}>
			<div className="w-full p-6 bg-white rounded-2xl dark:bg-gray-900">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
				{description && (
					<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
				)}

				<div className="flex justify-end gap-3">
					<Button variant="outline" onClick={onClose} size="sm">
						{cancelLabel}
					</Button>
					<Button variant="primary" onClick={onConfirm} size="sm" disabled={isPending}>
						{isPending ? "Guardando..." : confirmLabel}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ConfirmacionModal;