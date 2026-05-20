import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { onTourImageError } from "@/lib/imageFallback";

const postData: Record<string, { title: string; date: string; readTime: string; category: string; image: string; content: string[] }> = {
  "mejores-tours-la-paz": {
    title: "Los 10 mejores tours en La Paz que no puedes perderte",
    date: "2026-05-10",
    readTime: "5 min",
    category: "Destinos",
    image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1600&q=80&auto=format&fit=crop",
    content: ["blog.p1", "blog.p2", "blog.p3", "blog.p4", "blog.p5"],
  },
  "guia-whale-watching": {
    title: "Guía completa de avistamiento de ballenas en Baja",
    date: "2026-04-28",
    readTime: "7 min",
    category: "Naturaleza",
    image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1600&q=80&auto=format&fit=crop",
    content: ["blog.w1", "blog.w2", "blog.w3", "blog.w4"],
  },
  "gastronomia-baja": {
    title: "La gastronomía de Baja California Sur: una joya escondida",
    date: "2026-04-15",
    readTime: "6 min",
    category: "Gastronomía",
    image: "https://images.unsplash.com/photo-1565299543923-37dd37887442?w=1600&q=80&auto=format&fit=crop",
    content: ["blog.g1", "blog.g2", "blog.g3"],
  },
  "consejos-primeriza-baja": {
    title: "Consejos para viajeros primerizos en Baja California Sur",
    date: "2026-03-30",
    readTime: "8 min",
    category: "Consejos",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80&auto=format&fit=crop",
    content: ["blog.c1", "blog.c2", "blog.c3", "blog.c4"],
  },
  "pesca-deportiva-cabo": {
    title: "Pesca deportiva en Cabo: el paraíso del pescador",
    date: "2026-03-12",
    readTime: "5 min",
    category: "Aventura",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600&q=80&auto=format&fit=crop",
    content: ["blog.f1", "blog.f2", "blog.f3"],
  },
  "renta-casas-playa": {
    title: "Las mejores casas frente al mar para rentar en Baja",
    date: "2026-02-20",
    readTime: "6 min",
    category: "Hospedaje",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80&auto=format&fit=crop",
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
            <img src={post.image} alt={post.title} onError={onTourImageError} className="w-full h-full object-cover" />
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