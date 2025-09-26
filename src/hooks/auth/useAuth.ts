import { useNavigate } from "react-router";
import { login, LoginCredentials } from "../../services/auth/authService";
import { toast } from "sonner"

export const useAuth = () => {
    const navigate = useNavigate();

    const loginUser = async (credenciales: LoginCredentials) => {
        const { username, password } = credenciales;

        if (!username || !password) {
            toast.error("Por favor, completa todos los campos");
            return;
        }

        try {
            const { access, refresh } = await login(credenciales);

            // Guardar tokens en localStorage
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

            // Redirigir a la página principal
            navigate("/");
            toast.success("Inicio de sesión exitoso");
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 400) {
                toast.error("Credenciales Incorrectas.");
            } else {
                toast.error("Ocurrió un error inesperado, intenta más tarde.");
            }
        }
    }

    return { loginUser };
}