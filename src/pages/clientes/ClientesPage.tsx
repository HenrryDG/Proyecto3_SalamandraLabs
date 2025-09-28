import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ClienteTable from "../../components/tables/cliente/ClienteTable";
import { Pagination } from "../../components/tables/Pagination";
import { useClientes } from "../../hooks/cliente/useClientes";
import ClienteFilter from "../../components/filters/cliente/ClienteFilter";
import Button from "../../components/ui/button/Button";
import { FaPlus } from "react-icons/fa";
import { Cliente } from "../../types/cliente";

export default function ClientesPage() {
  const { clientes, loading, error, refetch } = useClientes();

  // ---------- Filtro de texto ---------- 
  const [filtro, setFiltro] = useState("");

  // ------------- Paginación ------------
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 7;

  // -------------- Filtrado -------------
  const clientesFiltrados = (clientes ?? [])
    .filter((cliente) =>
      `${cliente.nombre} ${cliente.apellido_paterno} ${cliente.apellido_materno} ${cliente.carnet} ${cliente.direccion} ${cliente.telefono} ${cliente.correo}`
        .toLowerCase()
        .includes(filtro.toLowerCase())
    );

  // ------------- Paginación  -----------
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFin = indiceInicio + elementosPorPagina;
  const clientesPaginados = clientesFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(clientesFiltrados.length / elementosPorPagina);

  // Reiniciar a la primera página al cambiar el filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro]);

  //  Cambios de página
  const onPrev = () => setPaginaActual((p) => Math.max(p - 1, 1));
  const onNext = () => setPaginaActual((p) => Math.min(p + 1, totalPaginas));


  return (
    <div>
      <PageMeta
        title="Clientes"
        description="Página de gestión de clientes"
      />
      <PageBreadcrumb pageTitle="Clientes" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 space-y-10">
        {/* === Filtros === */}
        <ClienteFilter
          filtro={filtro}
          setFiltro={setFiltro}
          child={
            <Button
              size="md"
              variant="primary"
            >
              <FaPlus className="size-3" />
              Nuevo Cliente
            </Button>
          }
        />

        {/* === Tabla / estados === */}
        <div className="max-w-full space-y-6">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Cargando clientes...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 dark:text-red-400">
              Error al cargar clientes.
            </p>
          ) : clientesFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No hay clientes que coincidan con el filtro.
            </p>
          ) : (
            <>
              <ClienteTable
                clientes={clientesPaginados}
              />
              <Pagination
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onPrev={onPrev}
                onNext={onNext}
              />
            </>
          )}
        </div>
      </div>


    </div>
  );
}
