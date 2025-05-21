import { Article } from "../../context/ArticleContext";
import ArticleCard from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

/**
 * تصميم احترافي وجذاب لشبكة المقالات:
 * - عنوان رئيسي مع خط سفلي متدرج وحركة خفيفة.
 * - عداد المقالات في شارة متوهجة.
 * - شبكة ديناميكية متجاوبة بمظهر عصري (بطاقات بحواف ناعمة وتباعد بصري مثالي).
 * - زر "عرض المزيد" متفاعل بظلال وحركة واضحة.
 * - رسالة عدم وجود مقالات بتصميم مميز مع أيقونة وشفافية.
 */

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
    <section className="mb-12">
      {/* عنوان جذاب */}
      <div className="flex flex-wrap items-center justify-between mb-7 pb-3 border-b-0 md:border-b-2 border-news-accent/70 relative">
        <h2 className="font-black text-2xl md:text-3xl lg:text-4xl text-gray-800 tracking-tight relative z-10 flex items-center gap-4">
          <span className="relative">
            <span className="z-10 relative">{title}</span>
            {/* خط سفلي متدرج عصري */}
            <span className="absolute -bottom-1 left-0 w-full h-2 rounded-full bg-gradient-to-r from-news-accent/50 via-news-accent/0 to-news-accent/80 blur-sm opacity-60"></span>
          </span>
        </h2>
        <span className="text-xs md:text-sm font-bold text-news-accent bg-news-accent/10 px-4 py-1 rounded-full shadow-inner border border-news-accent/10 animate-pulse flex items-center gap-1">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block -mt-0.5 text-news-accent animate-bounce" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
          {articles.length} مقال
        </span>
      </div>

      {/* شبكة المقالات */}
      {articles.length === 0 ? (
        <div className="py-16 text-center bg-gradient-to-br from-gray-50 to-white border border-dashed border-news-accent/30 rounded-xl shadow-inner flex flex-col items-center justify-center gap-2">
          <svg width={48} height={48} fill="none" stroke="#db1f2d" strokeWidth={1.5} viewBox="0 0 24 24" className="mb-2 opacity-60">
            <circle cx="12" cy="12" r="10" stroke="#db1f2d" strokeWidth="2" />
            <path d="M8 15h8M12 9v6" stroke="#db1f2d" strokeWidth="2" />
          </svg>
          <p className="text-gray-500 text-lg font-semibold opacity-80">لا توجد مقالات في هذا القسم حالياً</p>
        </div>
      ) : (
        <>
          <div
            className="
              grid grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-7
              md:gap-8
              xl:gap-10
              transition-all
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
            <div className="mt-12 text-center flex justify-center">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className={`
                  border-news-accent text-news-accent font-bold text-lg px-8 py-3 rounded-full
                  hover:bg-news-accent hover:text-white hover:shadow-lg transition
                  shadow-md border-2 border-opacity-40
                  flex items-center gap-2
                  focus:ring-2 focus:ring-news-accent focus:ring-offset-2
                  active:scale-95
                  group
                `}
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
