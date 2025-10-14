import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import CargarDocumentosModal from "../../components/modals/solicitudes/CargarDocumentosModal";

export default function DocumentosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <PageMeta
        title="Solicitudes"
        description="Página de gestión de solicitudes"
      />
      <PageBreadcrumb pageTitle="Solicitudes" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Gestión de Solicitudes
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base mb-8">
            Aquí puedes gestionar la información de las solicitudes de préstamo
          </p>

          {/* Botón de carga de documentos */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={handleOpenModal}
              startIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              }
            >
              Cargar Documentos
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de carga de documentos */}
      <CargarDocumentosModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
