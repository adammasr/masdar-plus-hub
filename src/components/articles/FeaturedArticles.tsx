import { useArticles } from "../../context/ArticleContext";
import ArticleCard from "./ArticleCard";
import { Newspaper } from "lucide-react";

// مسار اللوجو (تأكد من وجوده في public أو غيّر المسار حسب مكانه)
const LOGO_SRC = "/logo.png";

const FeaturedArticles = () => {
  const { featuredArticles } = useArticles();

  return (
    <section className="mb-14 relative">
      {/* زخرفة اللوجو خلف العنوان */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 pointer-events-none select-none opacity-10 z-0 hidden sm:block">
        <img
          src={LOGO_SRC}
          alt="ALMASDAR PLUS Logo Watermark"
          className="w-48 h-48 object-contain"
          draggable={false}
          style={{ filter: "blur(0.5px) drop-shadow(0 0 6px #db1f2d66)" }}
        />
      </div>

      {/* عنوان متكامل مع اللوجو والأيقونة وتدرج سفلي */}
      <div className="flex items-center gap-4 mb-8 pb-3 border-b-0 md:border-b-2 border-news-accent/80 relative z-10">
        <img
          src={LOGO_SRC}
          alt="ALMASDAR PLUS Logo"
          className="w-10 h-10 rounded-lg shadow border-2 border-white bg-white/90 object-contain"
        />
        <span className="relative font-black text-2xl md:text-3xl lg:text-4xl tracking-tight flex items-center gap-2 text-gray-800">
          <Newspaper className="inline-block text-news-accent -mt-1" size={26} />
          أهم الأخبار
          <span className="absolute -bottom-1 left-0 w-full h-2 rounded-full bg-gradient-to-r from-[#db1f2d]/40 via-transparent to-[#db1f2d]/60 blur-sm opacity-70"></span>
        </span>
        <span className="text-xs md:text-sm font-bold text-news-accent bg-news-accent/10 px-4 py-1 rounded-full shadow-inner border border-news-accent/10 animate-pulse ml-4">
          {featuredArticles.length} خبر مميز
        </span>
      </div>

      {/* عرض المقالات أو رسالة عدم وجود خبر مميز */}
      {featuredArticles.length === 0 ? (
        <div className="py-16 text-center bg-gradient-to-br from-gray-50 to-white border border-dashed border-news-accent/30 rounded-xl shadow-inner flex flex-col items-center justify-center gap-3 relative z-10">
          <img src={LOGO_SRC} alt="ALMASDAR PLUS Logo" className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-gray-500 text-lg font-semibold opacity-80">لا توجد أخبار مميزة حالياً</p>
        </div>
      ) : (
        <div
          className="
            grid grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
            md:gap-10
            xl:gap-12
            relative z-10
          "
        >
          {featuredArticles.slice(0, 3).map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              featured={index === 0}
              detailUrl={`/news/${article.id}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedArticles;
