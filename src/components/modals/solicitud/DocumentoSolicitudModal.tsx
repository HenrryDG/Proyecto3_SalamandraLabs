import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { Solicitud } from "../../../types/solicitud";
import { useDocumentos } from "../../../hooks/documento/useDocumentos";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  solicitud: Solicitud | null;
}

export default function DocumentosSolicitudModal({ isOpen, onClose, solicitud }: Props) {
  if (!solicitud) return null;

  const { documentos, loading, error } = useDocumentos(solicitud.id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Tipos válidos
  const tiposFactura = ["Factura de agua", "Factura de luz", "Factura de gas"];
  const tipoCarnet = "Fotocopia de carnet";

  // Filtrar documentos de la solicitud actual
  const documentosSolicitud = documentos.filter(
    (doc) => doc.solicitud === solicitud.id
  );

  // Ver si tiene al menos una factura válida
  const tieneFactura = documentosSolicitud.some((doc) =>
    tiposFactura.includes(doc.tipo_documento)
  );

  // Ver si tiene carnet
  const tieneCarnet = documentosSolicitud.some(
    (doc) => doc.tipo_documento === tipoCarnet
  );

  // Determinar qué documentos faltan
  const tiposFaltantes: string[] = [];
  if (!tieneFactura) tiposFaltantes.push("Factura de agua / luz / gas");
  if (!tieneCarnet) tiposFaltantes.push(tipoCarnet);

  const handleFileUpload = (tipoDocumento: string) => {
    if (!selectedFile) return alert("Selecciona un archivo primero.");

    // Aquí puedes integrar tu lógica de subida (por ejemplo, llamar a una función del hook)
    console.log(`Subiendo ${tipoDocumento} para solicitud ${solicitud.id}`, selectedFile);

    // Resetear input
    setSelectedFile(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-6">
          Documentación de Solicitud
        </h2>

        {/* --- Datos principales --- */}
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

        {/* --- Documentos Adjuntos --- */}
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
                  {documentosSolicitud.map((doc) => (
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

                      {!doc.verificado ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="text-xs text-gray-600"
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleFileUpload(doc.tipo_documento)}
                          >
                            Subir
                          </Button>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}

              {/* --- Tipos faltantes --- */}
              {tiposFaltantes.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Documentos faltantes
                  </h4>
                  <ul className="space-y-3">
                    {tiposFaltantes.map((tipo) => (
                      <li key={tipo} className="flex items-center justify-between gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{tipo}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="text-xs text-gray-600"
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleFileUpload(tipo)}
                          >
                            Subir
                          </Button>
                        </div>
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
