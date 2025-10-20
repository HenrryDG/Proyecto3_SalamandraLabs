import { useEffect, useState, useCallback } from "react";
import { getDocumentos } from "../../services/documento/documentoService";
import { Documento } from "../../types/documento";

export const useDocumentos = (documento_id: number) => {
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDocumentos = useCallback(async () => {
        if (!documento_id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getDocumentos(documento_id);
            setDocumentos(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cargar los documentos");
            setDocumentos([]);
        } finally {
            setLoading(false);
        }
    }, [documento_id]);

    useEffect(() => {
        fetchDocumentos();
    }, [fetchDocumentos]);

    return { documentos, loading, error, refetch: fetchDocumentos };
};
