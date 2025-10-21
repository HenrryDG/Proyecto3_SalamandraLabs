import Button from "../ui/button/Button";

interface Props {
  tipo: string;
  verificado?: boolean;
  isUploading: (tipo: string) => boolean;
  handleFileChange: (tipo: string, file: File | undefined) => void;
  handleUpload: (tipo: string) => Promise<void>;
  archivo?: File;
}

export default function DocumentoRow({
  tipo,
  verificado,
  isUploading,
  handleFileChange,
  handleUpload,
  archivo,
}: Props) {
  return (
    <li className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded-lg transition">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">{tipo}</p>
        {verificado !== undefined && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {verificado ? (
              <span className="text-green-600">Verificado</span>
            ) : (
              <span className="text-red-500">No verificado</span>
            )}
          </p>
        )}
      </div>
      {!verificado && (
        <div className="flex items-center gap-2">
          <label className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600">
            Seleccionar archivo
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFileChange(tipo, e.target.files?.[0] ?? undefined)}
              className="hidden"
              disabled={isUploading(tipo)}
            />
          </label>
          {archivo && <span className="text-sm text-gray-700 dark:text-gray-300">Imagen Cargada</span>}
          <Button variant="primary" size="sm" onClick={() => handleUpload(tipo)} disabled={isUploading(tipo)}>
            {isUploading(tipo) ? "Subiendo..." : "Subir"}
          </Button>
        </div>
      )}
    </li>
  );
}
