import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Forbidden from "./pages/OtherPage/Forbidden";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import RoleProtectedRoute from "./components/routes/RoleProtectedRoute";
import { Toaster } from "sonner";

import EmpleadosPage from "./pages/empleados/EmpleadosPage";
import ClientesPage from "./pages/clientes/ClientesPage";
import PrestamosPage from "./pages/prestamos/PrestamosPage";
import SolicitudesPage from "./pages/solicitudes/SolicitudesPage";

export default function App() {
  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} position="top-left" theme="light" visibleToasts={1} richColors closeButton />
      <Router>
        <ScrollToTop />
        <Routes>

          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Páginas */}
            <Route
              path="/empleados"
              element={
                <ProtectedRoute>
                  <RoleProtectedRoute allowedRoles={['Administrador']}>
                    <EmpleadosPage />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              }
            />

            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/prestamos" element={<PrestamosPage />} />
            <Route path="/solicitudes" element={<SolicitudesPage />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/ingresar" element={<SignIn />} />
          <Route path="/registrar" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/error-403" element={<Forbidden />} />
        </Routes>
      </Router>
    </>
  );
}
