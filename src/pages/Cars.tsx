import { useEffect, useMemo } from "react";
import { useArticles } from "../context/ArticleContext";
import ArticleCard from "../components/articles/ArticleCard";
import { Car } from "lucide-react";

const Cars = () => {
  const { articles } = useArticles();

  const carNews = useMemo(
    () =>
      articles
        .filter((a) => a.category === "سيارات")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [articles]
  );

  useEffect(() => {
    document.title = "السيارات | مصدر بلس";
  }, []);

  return (
    <div className="container mx-auto py-6 px-2">
      <div className="flex items-center mb-6">
        <Car className="w-8 h-8 text-blue-600 ml-3" />
        <h1 className="text-3xl font-bold text-gray-900">أخبار السيارات</h1>
      </div>

      {carNews.length === 0 ? (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">لا توجد أخبار سيارات متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carNews.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cars;
