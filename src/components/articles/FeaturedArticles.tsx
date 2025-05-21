
import { useArticles } from "../../context/ArticleContext";
import ArticleCard from "./ArticleCard";
import { Newspaper } from "lucide-react";

const FeaturedArticles = () => {
  const { featuredArticles } = useArticles();
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-news-accent flex items-center">
        <Newspaper className="inline-block ml-2" size={24} />
        أهم الأخبار
      </h2>
      
      {featuredArticles.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">لا توجد أخبار مميزة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {featuredArticles.slice(0, 3).map((article, index) => (
            <ArticleCard key={article.id} article={article} featured={index === 0} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedArticles;
