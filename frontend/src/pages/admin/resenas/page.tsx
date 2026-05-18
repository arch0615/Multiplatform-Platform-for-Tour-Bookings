import AdminLayout from "../components/AdminLayout";

const reviews = [
  { id: 1, tour: "Snorkel con tiburón ballena", user: "Ana López", rating: 5, comment: "Experiencia increíble, altamente recomendado", date: "2026-05-15", status: "approved" },
  { id: 2, tour: "Tour gastronómico La Paz", user: "Pedro Gómez", rating: 4, comment: "Muy buena comida, excelente guía", date: "2026-05-14", status: "approved" },
  { id: 3, tour: "Avistamiento de ballenas", user: "Sofía Hernández", rating: 5, comment: "Un sueño hecho realidad", date: "2026-05-13", status: "pending" },
  { id: 4, tour: "City tour histórico", user: "Mario Vargas", rating: 2, comment: "No cumplió con lo prometido", date: "2026-05-12", status: "reported" },
];

export default function AdminResenasPage() {
  return (
    <AdminLayout title="Reseñas">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-ocean/10 text-ocean font-bold text-sm shrink-0">
                {r.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-charcoal">{r.user}</span>
                  <div className="flex items-center gap-0.5 text-coral">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <i key={i} className="ri-star-fill text-xs" />
                    ))}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === "approved" ? "bg-ocean/10 text-ocean" : r.status === "pending" ? "bg-sand/60 text-charcoal" : "bg-coral/10 text-coral"}`}>
                    {r.status === "approved" ? "Aprobada" : r.status === "pending" ? "Pendiente" : "Reportada"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{r.comment}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{r.tour}</span>
                  <span>·</span>
                  <span>{r.date}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {r.status !== "approved" && (
                  <button className="text-xs text-ocean hover:underline">Aprobar</button>
                )}
                <button className="text-xs text-coral hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}