import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { Solicitud } from "../../../types/solicitud";
import { useDocumentos } from "../../../hooks/documento/useDocumentos";
import { useUploadCarnet } from "../../../hooks/documento/useUploadCarnet";
import { useUploadFactura } from "../../../hooks/documento/useUploadFactura";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  solicitud: Solicitud | null;
}

export default function DocumentosSolicitudModal({ isOpen, onClose, solicitud }: Props) {
  if (!solicitud) return null;

  const { documentos, loading, error, refetch } = useDocumentos(solicitud.id);

  const { uploading: uploadingCarnet, upload: uploadCarnet } = useUploadCarnet(solicitud.id);
  const { uploading: uploadingFactura, upload: uploadFactura } = useUploadFactura(solicitud.id);

  const tiposFactura = ["Factura de agua", "Factura de luz", "Factura de gas"];
  const tipoCarnet = "Fotocopia de carnet";

  const documentosSolicitud = documentos.filter(doc => doc.solicitud === solicitud.id);
  const tieneFactura = documentosSolicitud.some(doc => tiposFactura.includes(doc.tipo_documento));
  const tieneCarnet = documentosSolicitud.some(doc => doc.tipo_documento === tipoCarnet);

  const tiposFaltantes: string[] = [];
  if (!tieneFactura) tiposFaltantes.push("Factura de agua / luz / gas");
  if (!tieneCarnet) tiposFaltantes.push(tipoCarnet);

  const [archivos, setArchivos] = useState<{ [key: string]: File | undefined }>({});

  const handleFileChange = (tipo: string, file: File | undefined) => {
    setArchivos(prev => ({ ...prev, [tipo]: file }));
  };

  const handleUpload = async (tipo: string) => {
    const file = archivos[tipo];
    if (!file) {
      toast.warning("Debe subir una imagen");
      return;
    }

    try {
      if (tipo === tipoCarnet) {
        await uploadCarnet(file, refetch);
      } else {
        let tipoFacturaReal = "Factura de gas";
        if (tipo.toLowerCase().includes("agua")) tipoFacturaReal = "Factura de agua";
        if (tipo.toLowerCase().includes("luz")) tipoFacturaReal = "Factura de luz";
        await uploadFactura(file, tipoFacturaReal, refetch);
      }
    } finally {
      setArchivos(prev => ({ ...prev, [tipo]: undefined }));
    }
  };

  const isUploading = (tipo: string) =>
    tipo === tipoCarnet ? uploadingCarnet : uploadingFactura;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
          Documentación de Solicitud
        </h2>

        {/* Datos principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {solicitud.cliente_nombre}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monto Solicitado</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {Number(solicitud.monto_solicitado).toLocaleString("es-BO", {
                style: "currency",
                currency: "BOB",
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Documentos adjuntos */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Documentos Adjuntos
          </h3>

          {loading ? (
            <p className="text-gray-500 text-sm">Cargando documentos...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">Error al cargar los documentos.</p>
          ) : (
            <>
              {documentosSolicitud.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay documentos registrados.</p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-6">
                  {documentosSolicitud.map(doc => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded-lg transition"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {doc.tipo_documento}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {doc.verificado ? (
                            <span className="text-green-600">Verificado</span>
                          ) : (
                            <span className="text-red-500">No verificado</span>
                          )}
                        </p>
                      </div>

                      {!doc.verificado && (
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600">
                            Seleccionar archivo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e =>
                                handleFileChange(doc.tipo_documento, e.target.files?.[0] ?? undefined)
                              }
                              className="hidden"
                              disabled={isUploading(doc.tipo_documento)}
                            />
                          </label>
                          {archivos[doc.tipo_documento] && (
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Imagen Cargada
                            </span>
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpload(doc.tipo_documento)}
                            disabled={isUploading(doc.tipo_documento)}
                          >
                            {isUploading(doc.tipo_documento) ? "Subiendo..." : "Subir"}
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tipos faltantes */}
              {tiposFaltantes.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Documentos faltantes
                  </h4>
                  <ul className="space-y-3">
                    {tiposFaltantes.map(tipo => (
                      <li key={tipo} className="flex items-center justify-between gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{tipo}</span>

                        <label className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600">
                          Seleccionar archivo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e =>
                              handleFileChange(tipo, e.target.files?.[0] ?? undefined)
                            }
                            className="hidden"
                            disabled={isUploading(tipo)}
                          />
                        </label>

                        {archivos[tipo] && (
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Imagen Cargada  
                          </span>
                        )}

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpload(tipo)}
                          disabled={isUploading(tipo)}
                        >
                          {isUploading(tipo) ? "Subiendo..." : "Subir"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
