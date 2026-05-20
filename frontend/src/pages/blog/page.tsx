import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { onTourImageError } from "@/lib/imageFallback";

const posts = [
  {
    slug: "mejores-tours-la-paz",
    title: "Los 10 mejores tours en La Paz que no puedes perderte",
    excerpt: "Descubre las experiencias más impresionantes que La Paz tiene para ofrecer, desde snorkel con lobos marinos hasta kayak en Isla Espíritu Santo.",
    image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1200&q=80&auto=format&fit=crop",
    date: "2026-05-10",
    readTime: "5 min",
    category: "Destinos",
  },
  {
    slug: "guia-whale-watching",
    title: "Guía completa de avistamiento de ballenas en Baja",
    excerpt: "Todo lo que necesitas saber para vivir la experiencia de avistar ballenas grises en el Mar de Cortés durante la temporada.",
    image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&q=80&auto=format&fit=crop",
    date: "2026-04-28",
    readTime: "7 min",
    category: "Naturaleza",
  },
  {
    slug: "gastronomia-baja",
    title: "La gastronomía de Baja California Sur: una joya escondida",
    excerpt: "De los tacos de pescado de Ensenada a la alta cocina de La Paz, explora los sabores que hacen única a esta región.",
    image: "https://images.unsplash.com/photo-1565299543923-37dd37887442?w=1200&q=80&auto=format&fit=crop",
    date: "2026-04-15",
    readTime: "6 min",
    category: "Gastronomía",
  },
  {
    slug: "consejos-primeriza-baja",
    title: "Consejos para viajeros primerizos en Baja California Sur",
    excerpt: "Desde qué empacar hasta cómo moverte entre ciudades: todo lo que necesitas para tu primera visita a Baja.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80&auto=format&fit=crop",
    date: "2026-03-30",
    readTime: "8 min",
    category: "Consejos",
  },
  {
    slug: "pesca-deportiva-cabo",
    title: "Pesca deportiva en Cabo: el paraíso del pescador",
    excerpt: "Por qué Cabo San Lucas es conocido mundialmente como la capital de la pesca deportiva y cómo planificar tu aventura.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80&auto=format&fit=crop",
    date: "2026-03-12",
    readTime: "5 min",
    category: "Aventura",
  },
  {
    slug: "renta-casas-playa",
    title: "Las mejores casas frente al mar para rentar en Baja",
    excerpt: "Una selección de las propiedades más espectaculares para tus vacaciones, desde Todos Santos hasta Los Cabos.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop",
    date: "2026-02-20",
    readTime: "6 min",
    category: "Hospedaje",
  },
];

export default function BlogPage() {
  const { t, i18n } = useTranslation("blog");
  const locale = i18n.language === "es" ? "es-MX" : "en-US";

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <h1 className="font-display text-2xl md:text-4xl font-bold text-charcoal mb-3">{t("blog.title")}</h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">{t("blog.subtitle")}</p>
          </div>

          {/* Featured */}
          <Link to={`/blog/${posts[0].slug}`} className="block mb-10 group">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-56 md:h-72 overflow-hidden">
                  <img
                    src={posts[0].image}
                    alt={posts[0].title}
                    onError={onTourImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="inline-block w-fit bg-ocean/10 text-ocean text-xs font-medium px-3 py-1 rounded-full mb-3">
                    {posts[0].category}
                  </span>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal mb-3 group-hover:text-ocean transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">{posts[0].excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                    <span>{new Date(posts[0].date).toLocaleDateString(locale)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{posts[0].readTime} {t("blog.read")}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.slice(1).map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col">
                  <div className="h-44 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      onError={onTourImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="inline-block w-fit bg-ocean/10 text-ocean text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2">
                      {post.category}
                    </span>
                    <h3 className="font-semibold text-charcoal text-sm mb-2 group-hover:text-ocean transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-auto">
                      <span>{new Date(post.date).toLocaleDateString(locale)}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{post.readTime} {t("blog.read")}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}