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
}

export default function CargarDocumentosModal({ isOpen, onClose }: CargarDocumentosModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [validation, setValidation] = useState<ImageValidation>({ isValid: false });
    const [isUploading, setIsUploading] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLDivElement>(null);

    // Validar formato de archivo
    const validateFileFormat = (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        return validTypes.includes(file.type);
    };

    // Validar calidad de imagen
    const validateImageQuality = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const isValidSize = file.size > 200 * 1024; // > 200KB
                const isValidResolution = img.width >= 800 && img.height >= 600;
                resolve(isValidSize && isValidResolution);
            };
            img.onerror = () => resolve(false);
            img.src = URL.createObjectURL(file);
        });
    };

    // Manejar selección de archivo
    const handleFileSelect = useCallback(async (file: File) => {
        setSelectedFile(file);
        setValidation({ isValid: false });

        // Validar formato
        if (!validateFileFormat(file)) {
            setValidation({
                isValid: false,
                error: "Formato inválido. Solo se permiten imágenes en formato JPG, JPEG o PNG."
            });
            return;
        }

        // Validar calidad
        const isValidQuality = await validateImageQuality(file);
        if (!isValidQuality) {
            setValidation({
                isValid: false,
                error: "La imagen es demasiado pequeña o de baja calidad. Sube una imagen más clara."
            });
            return;
        }

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        setValidation({
            isValid: true,
            success: "Imagen cargada correctamente."
        });
    }, []);

    // Manejar drop de archivos
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, [handleFileSelect]);

    // Manejar click en dropzone
    const handleDropzoneClick = () => {
        fileInputRef.current?.click();
    };

    // Manejar cambio de input file
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    // Eliminar imagen seleccionada
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreview(null);
        setValidation({ isValid: false });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Simular carga
    const handleVerifyAndSave = async () => {
        if (!selectedFile || !validation.isValid) return;

        setIsUploading(true);
        setShowProgress(true);

        // Simular tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsUploading(false);
        setShowProgress(false);

        // Aquí se podría implementar la lógica de guardado real
        console.log('Archivo validado y listo para guardar:', selectedFile);

        // Cerrar modal después de la carga
        onClose();
    };

    // Resetear estado al cerrar
    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        setValidation({ isValid: false });
        setIsUploading(false);
        setShowProgress(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px] m-4">
            <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
                        Subir Documentos
                    </h2>

                    {/* Barra de progreso */}
                    {showProgress && (
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div className="bg-sky-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                        </div>
                    )}
                </div>

                {/* Zona de carga */}
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
                                <svg
                                    className="w-12 h-12 text-gray-400 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                                    Arrastra aquí tu documento
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    (JPG, JPEG o PNG) o haz clic para seleccionarlo
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                title="Eliminar imagen"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Input file oculto */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>

                {/* Mensajes de validación */}
                {validation.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{validation.error}</p>
                    </div>
                )}

                {validation.success && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                        <p className="text-sm text-green-600 dark:text-green-400">{validation.success}</p>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleVerifyAndSave}
                        disabled={!validation.isValid || isUploading}
                    >
                        {isUploading ? "Verificando..." : "Verificar y Guardar"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
