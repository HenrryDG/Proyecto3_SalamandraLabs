import { Navigate } from "react-router";
import { useEmpleado } from "../../hooks/empleado/useEmpleado";
import { JSX } from "react/jsx-runtime";

type RoleProtectedRouteProps = {
    allowedRoles: string[];
    children: JSX.Element;
};

const RoleProtectedRoute = ({ allowedRoles, children }: RoleProtectedRouteProps) => {
  const { empleado, loading } = useEmpleado(); // si tu hook devuelve loading

  if (loading) return null; // o un spinner

  const rolUsuario = empleado?.rol;
  console.log("Rol del usuario autenticado:", rolUsuario);

  if (!rolUsuario || !allowedRoles.includes(rolUsuario)) {
    return <Navigate to="/error-404" replace />;
  }

  return children;
};

export default RoleProtectedRoute;

