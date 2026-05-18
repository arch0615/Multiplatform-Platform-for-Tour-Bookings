import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const posts = [
  {
    slug: "mejores-tours-la-paz",
    title: "Los 10 mejores tours en La Paz que no puedes perderte",
    excerpt: "Descubre las experiencias más impresionantes que La Paz tiene para ofrecer, desde snorkel con lobos marinos hasta kayak en Isla Espíritu Santo.",
    image: "https://readdy.ai/api/search-image?query=Beautiful%20aerial%20view%20of%20La%20Paz%20bay%20in%20Baja%20California%20Sur%20Mexico%20with%20turquoise%20water%2C%20small%20boats%20and%20desert%20mountains%20in%20the%20background%2C%20golden%20hour%20travel%20photography%2C%20no%20text&width=800&height=500&seq=70&orientation=landscape",
    date: "2026-05-10",
    readTime: "5 min",
    category: "Destinos",
  },
  {
    slug: "guia-whale-watching",
    title: "Guía completa de avistamiento de ballenas en Baja",
    excerpt: "Todo lo que necesitas saber para vivir la experiencia de avistar ballenas grises en el Mar de Cortés durante la temporada.",
    image: "https://readdy.ai/api/search-image?query=Majestic%20gray%20whale%20breaching%20near%20a%20small%20panga%20boat%20in%20the%20Sea%20of%20Cortez%20Baja%20California%20Sur%20Mexico%20with%20dramatic%20splash%20and%20blue%20ocean%2C%20wildlife%20photography%2C%20no%20text&width=800&height=500&seq=71&orientation=landscape",
    date: "2026-04-28",
    readTime: "7 min",
    category: "Naturaleza",
  },
  {
    slug: "gastronomia-baja",
    title: "La gastronomía de Baja California Sur: una joya escondida",
    excerpt: "De los tacos de pescado de Ensenada a la alta cocina de La Paz, explora los sabores que hacen única a esta región.",
    image: "https://readdy.ai/api/search-image?query=Delicious%20Mexican%20seafood%20tacos%20with%20fresh%20fish%2C%20lime%2C%20cilantro%20and%20salsa%20on%20rustic%20wooden%20table%20in%20Baja%20California%20Sur%2C%20warm%20food%20photography%20with%20vibrant%20colors%2C%20no%20text&width=800&height=500&seq=72&orientation=landscape",
    date: "2026-04-15",
    readTime: "6 min",
    category: "Gastronomía",
  },
  {
    slug: "consejos-primeriza-baja",
    title: "Consejos para viajeros primerizos en Baja California Sur",
    excerpt: "Desde qué empacar hasta cómo moverte entre ciudades: todo lo que necesitas para tu primera visita a Baja.",
    image: "https://readdy.ai/api/search-image?query=Scenic%20desert%20highway%20in%20Baja%20California%20Sur%20Mexico%20with%20cacti%20on%20both%20sides%2C%20clear%20blue%20sky%20and%20distant%20mountains%2C%20road%20trip%20travel%20photography%2C%20warm%20golden%20light%2C%20no%20text&width=800&height=500&seq=73&orientation=landscape",
    date: "2026-03-30",
    readTime: "8 min",
    category: "Consejos",
  },
  {
    slug: "pesca-deportiva-cabo",
    title: "Pesca deportiva en Cabo: el paraíso del pescador",
    excerpt: "Por qué Cabo San Lucas es conocido mundialmente como la capital de la pesca deportiva y cómo planificar tu aventura.",
    image: "https://readdy.ai/api/search-image?query=Sport%20fishing%20boat%20on%20deep%20blue%20ocean%20with%20anglers%20holding%20large%20marlin%20catch%20in%20Cabo%20San%20Lucas%2C%20dramatic%20sports%20photography%20with%20clear%20sky%2C%20no%20text&width=800&height=500&seq=74&orientation=landscape",
    date: "2026-03-12",
    readTime: "5 min",
    category: "Aventura",
  },
  {
    slug: "renta-casas-playa",
    title: "Las mejores casas frente al mar para rentar en Baja",
    excerpt: "Una selección de las propiedades más espectaculares para tus vacaciones, desde Todos Santos hasta Los Cabos.",
    image: "https://readdy.ai/api/search-image?query=Luxury%20beachfront%20vacation%20rental%20house%20with%20infinity%20pool%20overlooking%20the%20Pacific%20Ocean%20in%20Baja%20California%20Sur%20Mexico%20at%20sunset%2C%20modern%20architecture%2C%20vacation%20rental%20photography%2C%20no%20text&width=800&height=500&seq=75&orientation=landscape",
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