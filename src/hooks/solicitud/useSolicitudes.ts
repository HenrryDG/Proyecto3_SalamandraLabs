import { useCallback, useEffect, useState } from "react";
import { getSolicitudes } from "../../services/solicitud/solicitudService";
import { Solicitud } from "../../types/solicitud";

export const useSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSolicitudes();
      setSolicitudes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar las solicitudes");
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  return { solicitudes, loading, error, refetch: fetchSolicitudes };
};
