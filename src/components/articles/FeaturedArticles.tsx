
import { useArticles } from "../../context/ArticleContext";
import ArticleCard from "./ArticleCard";

const FeaturedArticles = () => {
  const { featuredArticles } = useArticles();
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-news-accent">
        أهم الأخبار
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {featuredArticles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} featured={true} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedArticles;
