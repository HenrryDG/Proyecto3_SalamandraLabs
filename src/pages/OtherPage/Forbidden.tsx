import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { logout } from "../../services/auth/authService";




export default function Forbidden() {

  const navigate = useNavigate();


  async function handleLogout() {
    await logout();
    navigate("/ingresar");
  }

  return (
    <>
      <PageMeta
        title="Permiso Denegado"
        description="Página de error 403"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            ERROR
          </h1>

          <img src="/images/error/403.svg" alt="403" className="dark:hidden" />
          <img
            src="/images/error/403-dark.svg"
            alt="403"
            className="hidden dark:block"
          />

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            No tienes permiso para acceder a esta página.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Volver al inicio
            </Link>

            <Button
              variant="outline"
              onClick={handleLogout}
            >
              Iniciar sesión con otra cuenta
            </Button>
          </div>

        </div>
        {/* <!-- Footer --> */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - Salamandra Labs
        </p>
      </div>
    </>
  );
}
