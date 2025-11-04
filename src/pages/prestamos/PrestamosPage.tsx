import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PrestamoFilter from "../../components/filters/prestamo/PrestamoFilter";
import PrestamoTable from "../../components/tables/prestamo/PrestamoTable";
import { Pagination } from "../../components/tables/Pagination";
import { usePrestamos } from "../../hooks/prestamo/usePrestamos";


export default function SolicitudesPage() {
  const { prestamos, loading, error } = usePrestamos();



  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [rangoFechas, setRangoFechas] = useState<[Date | null, Date | null]>([null, null]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 6;

  // Filtrar solicitudes por texto y estado
  const prestamosFiltrados = (prestamos ?? []).filter((prestamo) =>
    `${prestamo.cliente_nombre} ${prestamo.monto_solicitado} ${prestamo.monto_aprobado} ${prestamo.monto_restante} ${prestamo.plazo_meses ?? ""}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  )
    .filter((prestamo) =>
      (estado === "Todos" ? true : prestamo.estado === estado)
    )
    .filter((prestamo) => {
      if (!rangoFechas[0] || !rangoFechas[1]) return true;

      function formatDateISO(date: Date | string): string {
        const d = new Date(date);
        return d.toISOString().slice(0, 10);
      }

      const fechaPrestamo = formatDateISO(prestamo.fecha_plazo);
      const fechaInicio = formatDateISO(rangoFechas[0]!);
      const fechaFin = formatDateISO(rangoFechas[1]!);

      return fechaPrestamo >= fechaInicio && fechaPrestamo <= fechaFin;
    });

  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const prestamosPaginados = prestamosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.max(1, Math.ceil(prestamosFiltrados.length / elementosPorPagina));

  useEffect(() => {
    setPaginaActual(1);
  }, [filtro, estado]);

  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));

  return (
    <div>
      <PageMeta title="Prestamos" description="Página de gestión de préstamos" />
      <PageBreadcrumb pageTitle="Prestamos" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-10">

        {/* === Filtros === */}
        <PrestamoFilter
          filtro={filtro}
          setFiltro={setFiltro}
          rango={rangoFechas}
          setRango={setRangoFechas}
          estado={estado}
          setEstado={setEstado}
        />

        <div className="max-w-full space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-center text-gray-500 dark:text-gray-400">Cargando préstamos...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 dark:text-red-400">Error al cargar préstamos.</p>
          ) : prestamosFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No hay préstamos que coincidan con el filtro.</p>
          ) : (
            <>
              <PrestamoTable prestamos={prestamosPaginados} />
              <Pagination paginaActual={paginaActual} totalPaginas={totalPaginas} onPrev={onPrev} onNext={onNext} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
