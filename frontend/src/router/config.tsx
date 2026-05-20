import type { RouteObject } from "react-router-dom";
import { RequireAuth, RequireRole } from "../components/auth/RouteGuards";
import { UserRole } from "../contexts/AuthContext";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ToursPage from "../pages/tours/page";
import TourDetailPage from "../pages/tour/page";
import BookingPage from "../pages/booking/page";
import BookingSuccessPage from "../pages/booking/success/page";
import ReservarRedirect from "../pages/reservar/redirect";
import ReservarPagoPage from "../pages/reservar/pago/page";
import PagoProcesandoPage from "../pages/pago/procesando/page";
import ReservarConfirmacionPage from "../pages/reservar/confirmacion/page";
import PagoFallidoPage from "../pages/pago/fallido/page";
import VoucherPage from "../pages/voucher/page";
import LoginPage from "../pages/login/page";
import RegisterRedirect from "../pages/register/redirect";
import RegistroPage from "../pages/registro/page";
import RegistroClientePage from "../pages/registro/cliente/page";
import RegistroProveedorPage from "../pages/registro/proveedor/page";
import ForgotPasswordPage from "../pages/recuperar-contrasena/page";
import ResetPasswordPage from "../pages/restablecer-contrasena/page";
import VerifyEmailPage from "../pages/verificar-email/page";
import ProfilePage from "../pages/profile/page";
import PerfilRedirect from "../pages/perfil/redirect";
import PerfilPage from "../pages/perfil/page";
import PerfilEditarPage from "../pages/perfil/editar/page";
import PerfilReservasPage from "../pages/perfil/reservas/page";
import PerfilFavoritosPage from "../pages/perfil/favoritos/page";
import PerfilResenasPage from "../pages/perfil/resenas/page";
import PerfilPagosPage from "../pages/perfil/pagos/page";
import PerfilNotificacionesPage from "../pages/perfil/notificaciones/page";
import PerfilSeguridadPage from "../pages/perfil/seguridad/page";
import PerfilEliminarPage from "../pages/perfil/eliminar/page";
import PerfilReservaDetallePage from "../pages/perfil/reservas/id/page";
import PerfilReservaCancelarPage from "../pages/perfil/reservas/id/cancelar/page";
import PerfilReservaResenaPage from "../pages/perfil/reservas/id/resena/page";
import ProviderDashboard from "../pages/provider/dashboard/page";
import ProviderProducts from "../pages/provider/products/page";
import ProviderProductNew from "../pages/provider/products/new/page";
import ProviderProductEdit from "../pages/provider/products/id/edit/page";
import ProviderCalendar from "../pages/provider/calendar/page";
import ProveedorRedirect from "../pages/proveedor/redirect";
import ProveedorProductosRedirect from "../pages/proveedor/productos/redirect";
import ProveedorCalendarioRedirect from "../pages/proveedor/calendario/redirect";
import ProveedorOnboardingPage from "../pages/proveedor/onboarding/page";
import ProveedorReservasPage from "../pages/proveedor/reservas/page";
import ProveedorResenasPage from "../pages/proveedor/resenas/page";
import ProveedorIngresosPage from "../pages/proveedor/ingresos/page";
import ProveedorEmpresaPage from "../pages/proveedor/empresa/page";
import ProveedorNotificacionesPage from "../pages/proveedor/notificaciones/page";
import ProveedorConfiguracionPage from "../pages/proveedor/configuracion/page";
import AdminDashboard from "../pages/admin/page";
import AdminProveedoresPage from "../pages/admin/proveedores/page";
import AdminProductosPage from "../pages/admin/productos/page";
import AdminReservasPage from "../pages/admin/reservas/page";
import AdminUsuariosPage from "../pages/admin/usuarios/page";
import AdminComisionesPage from "../pages/admin/comisiones/page";
import AdminCuponesPage from "../pages/admin/cupones/page";
import AdminResenasPage from "../pages/admin/resenas/page";
import AdminCategoriasPage from "../pages/admin/categorias/page";
import AdminDestinosPage from "../pages/admin/destinos/page";
import AdminReportesPage from "../pages/admin/reportes/page";
import AdminNotificacionesPage from "../pages/admin/notificaciones/page";
import AdminContenidoPage from "../pages/admin/contenido/page";
import AdminConfiguracionPage from "../pages/admin/configuracion/page";
import AdminAuditoriaPage from "../pages/admin/auditoria/page";
import AboutPage from "../pages/about/page";
import HowItWorksPage from "../pages/how-it-works/page";
import ContactPage from "../pages/contact/page";
import TermsPage from "../pages/terms/page";
import PrivacyPage from "../pages/privacy/page";
import CancellationPage from "../pages/cancellation/page";
import CategoryPage from "../pages/category/page";
import DestinationPage from "../pages/destination/page";
import ProviderLandingPage from "../pages/provider-landing/page";
import HelpPage from "../pages/help/page";
import FaqPage from "../pages/help/faq/page";
import HelpArticlePage from "../pages/help/article/page";
import BlogPage from "../pages/blog/page";
import BlogArticlePage from "../pages/blog/article/page";
import DashboardChrome from "../components/layout/DashboardChrome";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/tours", element: <ToursPage /> },
  { path: "/tours/:slug", element: <TourDetailPage /> },
  { path: "/booking/:slug", element: <RequireAuth><BookingPage /></RequireAuth> },
  { path: "/booking/success", element: <RequireAuth><BookingSuccessPage /></RequireAuth> },
  { path: "/reservar/:tourId", element: <RequireAuth><ReservarRedirect /></RequireAuth> },
  { path: "/reservar/:tourId/pago", element: <RequireAuth><ReservarPagoPage /></RequireAuth> },
  { path: "/pago/procesando", element: <RequireAuth><PagoProcesandoPage /></RequireAuth> },
  { path: "/reservar/confirmacion/:bookingId", element: <RequireAuth><ReservarConfirmacionPage /></RequireAuth> },
  { path: "/pago/fallido/:bookingId", element: <RequireAuth><PagoFallidoPage /></RequireAuth> },
  { path: "/voucher/:bookingId", element: <RequireAuth><VoucherPage /></RequireAuth> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterRedirect /> },
  { path: "/registro", element: <RegistroPage /> },
  { path: "/registro/cliente", element: <RegistroClientePage /> },
  { path: "/registro/proveedor", element: <RegistroProveedorPage /> },
  { path: "/recuperar-contrasena", element: <ForgotPasswordPage /> },
  { path: "/restablecer-contrasena/:token", element: <ResetPasswordPage /> },
  { path: "/verificar-email/:token", element: <VerifyEmailPage /> },
  {
    element: <DashboardChrome />,
    children: [
      { path: "/profile", element: <RequireAuth><ProfilePage /></RequireAuth> },
      { path: "/perfil", element: <RequireAuth><PerfilPage /></RequireAuth> },
      { path: "/perfil/editar", element: <RequireAuth><PerfilEditarPage /></RequireAuth> },
      { path: "/perfil/reservas", element: <RequireAuth><PerfilReservasPage /></RequireAuth> },
      { path: "/perfil/reservas/:id", element: <RequireAuth><PerfilReservaDetallePage /></RequireAuth> },
      { path: "/perfil/reservas/:id/cancelar", element: <RequireAuth><PerfilReservaCancelarPage /></RequireAuth> },
      { path: "/perfil/reservas/:id/resena", element: <RequireAuth><PerfilReservaResenaPage /></RequireAuth> },
      { path: "/perfil/favoritos", element: <RequireAuth><PerfilFavoritosPage /></RequireAuth> },
      { path: "/perfil/resenas", element: <RequireAuth><PerfilResenasPage /></RequireAuth> },
      { path: "/perfil/pagos", element: <RequireAuth><PerfilPagosPage /></RequireAuth> },
      { path: "/perfil/notificaciones", element: <RequireAuth><PerfilNotificacionesPage /></RequireAuth> },
      { path: "/perfil/seguridad", element: <RequireAuth><PerfilSeguridadPage /></RequireAuth> },
      { path: "/perfil/eliminar", element: <RequireAuth><PerfilEliminarPage /></RequireAuth> },
      { path: "/provider/dashboard", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProviderDashboard /></RequireRole> },
      { path: "/provider/products", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProviderProducts /></RequireRole> },
      { path: "/provider/products/new", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProviderProductNew /></RequireRole> },
      { path: "/provider/products/:id/edit", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProviderProductEdit /></RequireRole> },
      { path: "/provider/calendar", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProviderCalendar /></RequireRole> },
      { path: "/proveedor", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorRedirect /></RequireRole> },
      { path: "/proveedor/productos", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorProductosRedirect /></RequireRole> },
      { path: "/proveedor/calendario", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorCalendarioRedirect /></RequireRole> },
      { path: "/proveedor/onboarding", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorOnboardingPage /></RequireRole> },
      { path: "/proveedor/reservas", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorReservasPage /></RequireRole> },
      { path: "/proveedor/resenas", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorResenasPage /></RequireRole> },
      { path: "/proveedor/ingresos", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorIngresosPage /></RequireRole> },
      { path: "/proveedor/empresa", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorEmpresaPage /></RequireRole> },
      { path: "/proveedor/notificaciones", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorNotificacionesPage /></RequireRole> },
      { path: "/proveedor/configuracion", element: <RequireRole roles={[UserRole.Provider, UserRole.Admin]}><ProveedorConfiguracionPage /></RequireRole> },
      { path: "/admin", element: <RequireRole roles={[UserRole.Admin]}><AdminDashboard /></RequireRole> },
      { path: "/admin/proveedores", element: <RequireRole roles={[UserRole.Admin]}><AdminProveedoresPage /></RequireRole> },
      { path: "/admin/productos", element: <RequireRole roles={[UserRole.Admin]}><AdminProductosPage /></RequireRole> },
      { path: "/admin/reservas", element: <RequireRole roles={[UserRole.Admin]}><AdminReservasPage /></RequireRole> },
      { path: "/admin/usuarios", element: <RequireRole roles={[UserRole.Admin]}><AdminUsuariosPage /></RequireRole> },
      { path: "/admin/comisiones", element: <RequireRole roles={[UserRole.Admin]}><AdminComisionesPage /></RequireRole> },
      { path: "/admin/cupones", element: <RequireRole roles={[UserRole.Admin]}><AdminCuponesPage /></RequireRole> },
      { path: "/admin/resenas", element: <RequireRole roles={[UserRole.Admin]}><AdminResenasPage /></RequireRole> },
      { path: "/admin/categorias", element: <RequireRole roles={[UserRole.Admin]}><AdminCategoriasPage /></RequireRole> },
      { path: "/admin/destinos", element: <RequireRole roles={[UserRole.Admin]}><AdminDestinosPage /></RequireRole> },
      { path: "/admin/reportes", element: <RequireRole roles={[UserRole.Admin]}><AdminReportesPage /></RequireRole> },
      { path: "/admin/notificaciones", element: <RequireRole roles={[UserRole.Admin]}><AdminNotificacionesPage /></RequireRole> },
      { path: "/admin/contenido", element: <RequireRole roles={[UserRole.Admin]}><AdminContenidoPage /></RequireRole> },
      { path: "/admin/configuracion", element: <RequireRole roles={[UserRole.Admin]}><AdminConfiguracionPage /></RequireRole> },
      { path: "/admin/auditoria", element: <RequireRole roles={[UserRole.Admin]}><AdminAuditoriaPage /></RequireRole> },
    ],
  },
  { path: "/nosotros", element: <AboutPage /> },
  { path: "/como-funciona", element: <HowItWorksPage /> },
  { path: "/contacto", element: <ContactPage /> },
  { path: "/terminos", element: <TermsPage /> },
  { path: "/privacidad", element: <PrivacyPage /> },
  { path: "/politica-cancelacion", element: <CancellationPage /> },
  { path: "/categoria/:slug", element: <CategoryPage /> },
  { path: "/destino/:slug", element: <DestinationPage /> },
  { path: "/proveedores", element: <ProviderLandingPage /> },
  { path: "/ayuda", element: <HelpPage /> },
  { path: "/ayuda/faq", element: <FaqPage /> },
  { path: "/ayuda/:slug", element: <HelpArticlePage /> },
  { path: "/blog", element: <BlogPage /> },
  { path: "/blog/:slug", element: <BlogArticlePage /> },
  { path: "*", element: <NotFound /> },
];

export default routes;