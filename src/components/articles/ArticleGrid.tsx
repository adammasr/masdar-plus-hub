import { Article } from "../../context/ArticleContext";
import ArticleCard from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

// مسار اللوجو (تأكد من وضع اللوجو في public/logo.png أو غيّر المسار حسب مكانه)
const LOGO_SRC = "/logo.png";

interface ArticleGridProps {
  articles: Article[];
  title: string;
  initialLimit?: number;
}

const ArticleGrid = ({ articles, title, initialLimit = 6 }: ArticleGridProps) => {
  const [limit, setLimit] = useState(initialLimit);

  const handleLoadMore = () => {
    setLimit(prev => prev + 6);
  };

  const displayedArticles = articles.slice(0, limit);
  const hasMore = articles.length > limit;

  return (
    <section className="relative mb-14">
      {/* زخرفة اللوجو خلف العنوان */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 pointer-events-none select-none opacity-10 z-0 hidden sm:block">
        <img
          src={LOGO_SRC}
          alt="ALMASDAR PLUS Logo Watermark"
          className="w-64 h-64 object-contain"
          draggable={false}
          style={{ filter: "blur(0.5px) drop-shadow(0 0 6px #db1f2d55)" }}
        />
      </div>

      {/* عنوان مع اللوجو صغير بجانبه */}
      <div className="flex flex-wrap items-center justify-between mb-8 pb-3 border-b-0 md:border-b-2 border-news-accent/80 relative z-10">
        <div className="flex items-center gap-4">
          <img
            src={LOGO_SRC}
            alt="ALMASDAR PLUS Logo"
            className="w-10 h-10 rounded-lg shadow-md border-2 border-white bg-white/90 object-contain"
          />
          <h2 className="font-black text-2xl md:text-3xl lg:text-4xl text-gray-800 tracking-tight relative">
            <span className="relative">
              {title}
              {/* خط سفلي متدرج عصري */}
              <span className="absolute -bottom-1 left-0 w-full h-2 rounded-full bg-gradient-to-r from-[#db1f2d]/40 via-transparent to-[#db1f2d]/60 blur-sm opacity-70"></span>
            </span>
          </h2>
        </div>
        <span className="text-xs md:text-sm font-bold text-news-accent bg-news-accent/10 px-4 py-1 rounded-full shadow-inner border border-news-accent/10 animate-pulse flex items-center gap-1">
          <svg width="18" height="18" fill="none" stroke="#db1f2d" strokeWidth="2" className="inline-block -mt-0.5 animate-bounce" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
          {articles.length} مقال
        </span>
      </div>

      {/* شبكة المقالات */}
      {articles.length === 0 ? (
        <div className="py-20 text-center bg-gradient-to-br from-gray-50 to-white border border-dashed border-news-accent/30 rounded-xl shadow-inner flex flex-col items-center justify-center gap-3 relative z-10">
          <img src={LOGO_SRC} alt="ALMASDAR PLUS Logo" className="w-20 h-20 mb-4 opacity-50" />
          <p className="text-gray-500 text-lg font-semibold opacity-80">لا توجد مقالات في هذا القسم حالياً</p>
        </div>
      ) : (
        <>
          <div
            className="
              grid grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-8
              md:gap-10
              xl:gap-12
              transition-all
              relative z-10
            "
          >
            {displayedArticles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                featured={i === 0 && limit === initialLimit} // أول مقال فقط يكون featured في الصفحة الأولى
                detailUrl={`/news/${article.id}`}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-14 text-center flex justify-center relative z-10">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="
                  border-news-accent text-news-accent font-bold text-lg px-10 py-3 rounded-full
                  bg-gradient-to-r from-[#db1f2d]/5 via-white to-[#db1f2d]/10
                  hover:bg-news-accent hover:text-white hover:shadow-xl transition
                  shadow-md border-2 border-opacity-40
                  flex items-center gap-2
                  focus:ring-2 focus:ring-news-accent focus:ring-offset-2
                  active:scale-95
                  group
                "
              >
                <span className="group-hover:pr-2 transition-all">عرض المزيد</span>
                <ChevronLeft className="ml-1 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ArticleGrid;
