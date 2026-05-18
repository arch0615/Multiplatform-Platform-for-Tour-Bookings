import type { RouteObject } from "react-router-dom";
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

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/tours", element: <ToursPage /> },
  { path: "/tours/:slug", element: <TourDetailPage /> },
  { path: "/booking/:tourId", element: <BookingPage /> },
  { path: "/booking/success", element: <BookingSuccessPage /> },
  { path: "/reservar/:tourId", element: <ReservarRedirect /> },
  { path: "/reservar/:tourId/pago", element: <ReservarPagoPage /> },
  { path: "/pago/procesando", element: <PagoProcesandoPage /> },
  { path: "/reservar/confirmacion/:bookingId", element: <ReservarConfirmacionPage /> },
  { path: "/pago/fallido/:bookingId", element: <PagoFallidoPage /> },
  { path: "/voucher/:bookingId", element: <VoucherPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterRedirect /> },
  { path: "/registro", element: <RegistroPage /> },
  { path: "/registro/cliente", element: <RegistroClientePage /> },
  { path: "/registro/proveedor", element: <RegistroProveedorPage /> },
  { path: "/recuperar-contrasena", element: <ForgotPasswordPage /> },
  { path: "/restablecer-contrasena/:token", element: <ResetPasswordPage /> },
  { path: "/verificar-email/:token", element: <VerifyEmailPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/perfil", element: <PerfilPage /> },
  { path: "/perfil/editar", element: <PerfilEditarPage /> },
  { path: "/perfil/reservas", element: <PerfilReservasPage /> },
  { path: "/perfil/reservas/:id", element: <PerfilReservaDetallePage /> },
  { path: "/perfil/reservas/:id/cancelar", element: <PerfilReservaCancelarPage /> },
  { path: "/perfil/reservas/:id/resena", element: <PerfilReservaResenaPage /> },
  { path: "/perfil/favoritos", element: <PerfilFavoritosPage /> },
  { path: "/perfil/resenas", element: <PerfilResenasPage /> },
  { path: "/perfil/pagos", element: <PerfilPagosPage /> },
  { path: "/perfil/notificaciones", element: <PerfilNotificacionesPage /> },
  { path: "/perfil/seguridad", element: <PerfilSeguridadPage /> },
  { path: "/perfil/eliminar", element: <PerfilEliminarPage /> },
  { path: "/provider/dashboard", element: <ProviderDashboard /> },
  { path: "/provider/products", element: <ProviderProducts /> },
  { path: "/provider/calendar", element: <ProviderCalendar /> },
  { path: "/proveedor", element: <ProveedorRedirect /> },
  { path: "/proveedor/productos", element: <ProveedorProductosRedirect /> },
  { path: "/proveedor/calendario", element: <ProveedorCalendarioRedirect /> },
  { path: "/proveedor/onboarding", element: <ProveedorOnboardingPage /> },
  { path: "/proveedor/reservas", element: <ProveedorReservasPage /> },
  { path: "/proveedor/resenas", element: <ProveedorResenasPage /> },
  { path: "/proveedor/ingresos", element: <ProveedorIngresosPage /> },
  { path: "/proveedor/empresa", element: <ProveedorEmpresaPage /> },
  { path: "/proveedor/notificaciones", element: <ProveedorNotificacionesPage /> },
  { path: "/proveedor/configuracion", element: <ProveedorConfiguracionPage /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/admin/proveedores", element: <AdminProveedoresPage /> },
  { path: "/admin/productos", element: <AdminProductosPage /> },
  { path: "/admin/reservas", element: <AdminReservasPage /> },
  { path: "/admin/usuarios", element: <AdminUsuariosPage /> },
  { path: "/admin/comisiones", element: <AdminComisionesPage /> },
  { path: "/admin/cupones", element: <AdminCuponesPage /> },
  { path: "/admin/resenas", element: <AdminResenasPage /> },
  { path: "/admin/categorias", element: <AdminCategoriasPage /> },
  { path: "/admin/destinos", element: <AdminDestinosPage /> },
  { path: "/admin/reportes", element: <AdminReportesPage /> },
  { path: "/admin/notificaciones", element: <AdminNotificacionesPage /> },
  { path: "/admin/contenido", element: <AdminContenidoPage /> },
  { path: "/admin/configuracion", element: <AdminConfiguracionPage /> },
  { path: "/admin/auditoria", element: <AdminAuditoriaPage /> },
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