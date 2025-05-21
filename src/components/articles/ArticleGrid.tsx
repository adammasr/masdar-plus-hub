import { Article } from "../../context/ArticleContext";
import ArticleCard from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

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
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-news-accent flex justify-between items-center">
        {title}
        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {articles.length} مقال
        </span>
      </h2>

      {articles.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">لا توجد مقالات في هذا القسم حالياً</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                detailUrl={`/news/${article.id}`}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="border-news-accent text-news-accent hover:bg-news-accent hover:text-white"
              >
                عرض المزيد
                <ChevronLeft className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArticleGrid;
