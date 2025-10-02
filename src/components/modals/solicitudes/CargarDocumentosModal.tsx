import { useState, useRef, useCallback } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";

interface CargarDocumentosModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ImageValidation {
    isValid: boolean;
    error?: string;
    success?: string;
    warning?: string;
}

export default function CargarDocumentosModal({ isOpen, onClose }: CargarDocumentosModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [validation, setValidation] = useState<ImageValidation>({ isValid: false });
    const [isUploading, setIsUploading] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLDivElement>(null);

    // Validar formato
    const validateFileFormat = (file: File): boolean => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        return validTypes.includes(file.type);
    };

    // Validar calidad de imagen

    const validateImageQuality = (file: File): Promise<{ isValid: boolean; warning?: string }> => {
        return new Promise((resolve) => {
            const img = new Image();
            const minSize = 100 * 1024; // 100KB mínimo
            img.onload = () => {
                if (file.size < minSize) {
                    resolve({ isValid: false });
                } else {
                    resolve({ isValid: true });
                }
            };
            img.onerror = () => resolve({ isValid: false });
            img.src = URL.createObjectURL(file);
        });
    };

    // Manejar selección
    const handleFileSelect = useCallback(async (file: File) => {
        setSelectedFile(file);
        setValidation({ isValid: false });

        if (!validateFileFormat(file)) {
            setValidation({
                isValid: false,
                error: "Formato inválido. Solo se permiten imágenes JPG, JPEG o PNG."
            });
            return;
        }

        if (file.size < 100 * 1024) {
            setValidation({
                isValid: false,
                error: "La imagen es demasiado liviana. Debe tener al menos 100 KB."
            });
            return;
        }

        const qualityResult = await validateImageQuality(file);
        if (!qualityResult.isValid) {
            setValidation({
                isValid: false,
                error: "La imagen es demasiado pequeña o de baja calidad. Sube una imagen más clara."
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        setValidation({
            isValid: true,
            success: "Imagen cargada correctamente.",
            warning: qualityResult.warning
        });
    }, []);

    // Manejar drag & drop
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) handleFileSelect(files[0]);
    }, [handleFileSelect]);

    const handleDropzoneClick = () => fileInputRef.current?.click();

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Eliminar imagen
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreview(null);
        setValidation({ isValid: false });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleLoadAnotherImage = () => {
        handleRemoveImage();
        fileInputRef.current?.click();
    };

    // Simular verificación
    const handleVerifyAndSave = async () => {
        if (!selectedFile || !validation.isValid) return;

        setIsUploading(true);
        setShowProgress(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsUploading(false);
        setShowProgress(false);

        console.log("Archivo validado y listo:", selectedFile);
        onClose();
    };

    // Resetear al cerrar
    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        setValidation({ isValid: false });
        setIsUploading(false);
        setShowProgress(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">Subir Documentos</h2>
                    {showProgress && (
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-3">
                            <div className="bg-sky-500 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
                        </div>
                    )}
                </div>

                {/* Dropzone / Preview */}
                <div className="mb-6">
                    {!preview ? (
                        <div
                            ref={dropzoneRef}
                            onClick={handleDropzoneClick}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-900/20 transition-colors"
                        >
                            <div className="flex flex-col items-center">
                                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Arrastra aquí tu documento</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">(JPG, JPEG o PNG) o haz clic para seleccionarlo</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                    <span>Asegúrate de subir imágenes legibles y de buena calidad.</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative flex justify-center">
                                <div className="max-w-[300px] max-h-[300px] flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                                </div>
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                    title="Eliminar imagen"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFileInputChange} className="hidden" />
                </div>

                {/* Mensajes */}
                {validation.error && (
                    <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg dark:bg-error-500/15 dark:border-error-800 text-error-600 dark:text-error-500 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-error-600 dark:text-error-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {validation.error}
                        </div>
                    </div>
                )}
                {validation.success && (
                    <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg dark:bg-success-500/15 dark:border-success-800 text-success-600 dark:text-success-500 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-success-600 dark:text-success-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {validation.success}
                        </div>
                    </div>
                )}
                {validation.warning && (
                    <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg dark:bg-warning-500/15 dark:border-warning-800 text-warning-600 dark:text-orange-400 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-warning-600 dark:text-warning-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            {validation.warning}
                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-center gap-3">
                    <Button
                        variant="error"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        Cancelar
                    </Button>
                    {preview && (
                        <Button
                            variant="outline"
                            onClick={handleLoadAnotherImage}
                            disabled={isUploading}
                        >
                            Cargar Otra Imagen
                        </Button>
                    )}
                    <Button variant="primary" onClick={handleVerifyAndSave} disabled={!validation.isValid || isUploading}>
                        {isUploading ? "Verificando..." : "Verificar y Guardar"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
