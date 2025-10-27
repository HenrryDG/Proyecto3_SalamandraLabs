import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import SolicitudFilter from "../../components/filters/solicitud/SolicitudFilter";
import SolicitudTable from "../../components/tables/solicitud/SolicitudTable";
import { Pagination } from "../../components/tables/Pagination";
import { useSolicitudes } from "../../hooks/solicitud/useSolicitudes";
import { useModal } from "../../hooks/useModal";
import CreateSolicitudModal from "../../components/modals/solicitud/CreateSolicitudModal";
import EditSolicitudModal from "../../components/modals/solicitud/EditSolicitudModal";
import { Solicitud } from "../../types/solicitud";
import { FaPlus } from "react-icons/fa";
import DocumentosSolicitudModal from "../../components/modals/solicitud/DocumentoSolicitudModal";

export default function SolicitudesPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const { solicitudes, loading, error, refetch } = useSolicitudes();

  //Edición
  const [solicitudEdit, setSolicitudEdit] = useState<Solicitud | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (solicitud: Solicitud) => {
    setSolicitudEdit(solicitud);
    setIsEditOpen(true);
  };

  // Documentación
  const [solicitudView, setSolicitudView] = useState<Solicitud | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleView = (solicitud: Solicitud) => {
    // No abrir el modal si la solicitud está rechazada
    if (solicitud.estado === "Rechazada") return;
    
    setSolicitudView(solicitud);
    setIsViewOpen(true);
  };

  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [rangoFechas, setRangoFechas] = useState<[Date | null, Date | null]>([null, null]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  // Filtrar solicitudes por texto y estado
  const solicitudesFiltradas = (solicitudes ?? []).filter((solicitud) =>
    `${solicitud.empleado_nombre} ${solicitud.cliente_nombre} ${solicitud.monto_solicitado} ${solicitud.proposito} ${solicitud.observaciones ?? ""}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  )
    .filter((solicitud) =>
      (estado === "Todos" ? true : solicitud.estado === estado)
    )
    .filter((solicitud) => {
      if (!rangoFechas[0] || !rangoFechas[1]) return true;

      function formatDateISO(date: Date | string): string {
        const d = new Date(date);
        return d.toISOString().slice(0, 10);
      }

      const fechaSolicitud = formatDateISO(solicitud.fecha_solicitud);
      const fechaInicio = formatDateISO(rangoFechas[0]!);
      const fechaFin = formatDateISO(rangoFechas[1]!);

      return fechaSolicitud >= fechaInicio && fechaSolicitud <= fechaFin;
    });

  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const solicitudesPaginadas = solicitudesFiltradas.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.max(1, Math.ceil(solicitudesFiltradas.length / elementosPorPagina));

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, estado]);

  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  const handleNuevaSolicitud = () => {
    openModal();
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
          rango={rangoFechas}
          setRango={setRangoFechas}
          estado={estado}
          setEstado={setEstado}
          child={
            <Button
              size="md"
              variant="primary"
              onClick={handleNuevaSolicitud}
            >
              <FaPlus className="size-3" />
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
              <SolicitudTable solicitudes={solicitudesPaginadas} onEdit={handleEdit} onView={handleView} />
              <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPrev={onPrev} onNext={onNext} />
            </>
          )}
        </div>
      </div>

      {/* === Modal de creación de solicitud === */}
      <CreateSolicitudModal
        isOpen={isOpen}
        onClose={closeModal}
        onCreated={refetch}
      />

      {/* === Modal de edición === */}
      <EditSolicitudModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        solicitud={solicitudEdit}
        onUpdated={refetch}
      />

      {/* === Modal de documentación === */}
      <DocumentosSolicitudModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        solicitud={solicitudView}
      />
    </div>
  );
}
