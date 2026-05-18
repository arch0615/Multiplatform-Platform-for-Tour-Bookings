export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/526121234567?text=Hola%20Baja%20Tours%2C%20tengo%20una%20pregunta"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
      aria-label="Contactar por WhatsApp"
    >
      <i className="ri-whatsapp-line text-white text-2xl" />
    </a>
  );
}