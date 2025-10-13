import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import SolicitudFilter from "../../components/filters/solicitud/SolicitudFilter";
import SolicitudTable from "../../components/tables/solicitud/SolicitudTable";
import { Pagination } from "../../components/tables/Pagination";
import { useSolicitudes } from "../../hooks/solicitud/useSolicitudes";

export default function SolicitudesPage() {
  const { solicitudes, loading, error } = useSolicitudes();

  const [filtro, setFiltro] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  // Filtrar solicitudes por texto y estado
  const solicitudesFiltradas = (solicitudes ?? [])
    .filter((s) =>
      `${s.empleado_nombre} ${s.cliente_nombre} ${s.monto_solicitado} ${s.proposito} ${s.observaciones ?? ""}`
        .toLowerCase()
        .includes(filtro.toLowerCase())
    );
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const solicitudesPaginadas = solicitudesFiltradas.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.max(1, Math.ceil(solicitudesFiltradas.length / elementosPorPagina));

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro]);

  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  const handleNuevoDocumento = () => {
    console.log("Nueva Solicitud");
  };

  return (
    <div>
      <PageMeta title="Solicitudes" description="Página de gestión de solicitudes" />
      <PageBreadcrumb pageTitle="Solicitudes" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-10">

        {/* === Filtros === */}
        <SolicitudFilter
          filtro={filtro}
          setFiltro={setFiltro}
          child={
            <Button
              size="md"
              variant="primary"
              onClick={handleNuevoDocumento}
            >
              Nueva Solicitud
            </Button>
          }
        />

        <div className="max-w-full space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-center text-gray-500 dark:text-gray-400">Cargando solicitudes...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 dark:text-red-400">Error al cargar solicitudes.</p>
          ) : solicitudesFiltradas.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No hay solicitudes que coincidan con el filtro.</p>
          ) : (
            <>
              <SolicitudTable solicitudes={solicitudesPaginadas} onEdit={(solicitud) => console.log("editando", solicitud)} />
              <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPrev={onPrev} onNext={onNext} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
