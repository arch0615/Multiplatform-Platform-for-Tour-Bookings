import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";

const postData: Record<string, { title: string; date: string; readTime: string; category: string; image: string; content: string[] }> = {
  "mejores-tours-la-paz": {
    title: "Los 10 mejores tours en La Paz que no puedes perderte",
    date: "2026-05-10",
    readTime: "5 min",
    category: "Destinos",
    image: "https://readdy.ai/api/search-image?query=Beautiful%20aerial%20view%20of%20La%20Paz%20bay%20in%20Baja%20California%20Sur%20Mexico%20with%20turquoise%20water%2C%20small%20boats%20and%20desert%20mountains%20in%20the%20background%2C%20golden%20hour%20travel%20photography%2C%20no%20text&width=900&height=500&seq=70&orientation=landscape",
    content: ["blog.p1", "blog.p2", "blog.p3", "blog.p4", "blog.p5"],
  },
  "guia-whale-watching": {
    title: "Guía completa de avistamiento de ballenas en Baja",
    date: "2026-04-28",
    readTime: "7 min",
    category: "Naturaleza",
    image: "https://readdy.ai/api/search-image?query=Majestic%20gray%20whale%20breaching%20near%20a%20small%20panga%20boat%20in%20the%20Sea%20of%20Cortez%20Baja%20California%20Sur%20Mexico%20with%20dramatic%20splash%20and%20blue%20ocean%2C%20wildlife%20photography%2C%20no%20text&width=900&height=500&seq=71&orientation=landscape",
    content: ["blog.w1", "blog.w2", "blog.w3", "blog.w4"],
  },
  "gastronomia-baja": {
    title: "La gastronomía de Baja California Sur: una joya escondida",
    date: "2026-04-15",
    readTime: "6 min",
    category: "Gastronomía",
    image: "https://readdy.ai/api/search-image?query=Delicious%20Mexican%20seafood%20tacos%20with%20fresh%20fish%2C%20lime%2C%20cilantro%20and%20salsa%20on%20rustic%20wooden%20table%20in%20Baja%20California%20Sur%2C%20warm%20food%20photography%20with%20vibrant%20colors%2C%20no%20text&width=900&height=500&seq=72&orientation=landscape",
    content: ["blog.g1", "blog.g2", "blog.g3"],
  },
  "consejos-primeriza-baja": {
    title: "Consejos para viajeros primerizos en Baja California Sur",
    date: "2026-03-30",
    readTime: "8 min",
    category: "Consejos",
    image: "https://readdy.ai/api/search-image?query=Scenic%20desert%20highway%20in%20Baja%20California%20Sur%20Mexico%20with%20cacti%20on%20both%20sides%2C%20clear%20blue%20sky%20and%20distant%20mountains%2C%20road%20trip%20travel%20photography%2C%20warm%20golden%20light%2C%20no%20text&width=900&height=500&seq=73&orientation=landscape",
    content: ["blog.c1", "blog.c2", "blog.c3", "blog.c4"],
  },
  "pesca-deportiva-cabo": {
    title: "Pesca deportiva en Cabo: el paraíso del pescador",
    date: "2026-03-12",
    readTime: "5 min",
    category: "Aventura",
    image: "https://readdy.ai/api/search-image?query=Sport%20fishing%20boat%20on%20deep%20blue%20ocean%20with%20anglers%20holding%20large%20marlin%20catch%20in%20Cabo%20San%20Lucas%2C%20dramatic%20sports%20photography%20with%20clear%20sky%2C%20no%20text&width=900&height=500&seq=74&orientation=landscape",
    content: ["blog.f1", "blog.f2", "blog.f3"],
  },
  "renta-casas-playa": {
    title: "Las mejores casas frente al mar para rentar en Baja",
    date: "2026-02-20",
    readTime: "6 min",
    category: "Hospedaje",
    image: "https://readdy.ai/api/search-image?query=Luxury%20beachfront%20vacation%20rental%20house%20with%20infinity%20pool%20overlooking%20the%20Pacific%20Ocean%20in%20Baja%20California%20Sur%20Mexico%20at%20sunset%2C%20modern%20architecture%2C%20vacation%20rental%20photography%2C%20no%20text&width=900&height=500&seq=75&orientation=landscape",
    content: ["blog.h1", "blog.h2", "blog.h3"],
  },
};

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation("blog");
  const locale = i18n.language === "es" ? "es-MX" : "en-US";

  const post = useMemo(() => (slug ? postData[slug] : undefined), [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-offwhite pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-300">
            <i className="ri-article-line text-4xl" />
          </div>
          <h1 className="text-xl font-bold text-charcoal mb-2">{t("blog.notFound")}</h1>
          <Link to="/blog" className="inline-flex bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full">
            {t("blog.backToBlog")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-14 md:pt-20">
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link to="/blog" className="hover:text-ocean transition-colors">{t("blog.backToBlog")}</Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-charcoal">{post.category}</span>
          </div>

          <span className="inline-block bg-ocean/10 text-ocean text-xs font-medium px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
            <span>{new Date(post.date).toLocaleDateString(locale)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{post.readTime} {t("blog.read")}</span>
          </div>

          <div className="rounded-2xl overflow-hidden h-64 md:h-80 mb-8">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-5">
            {post.content.map((p, i) => (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">{t(p)}</p>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <i className="ri-arrow-left-line" />
              {t("blog.backToBlog")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}