
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { TrendingUp } from "lucide-react";

const Politics = () => {
  const { articles } = useArticles();
  
  const politicsArticles = articles
    .filter(article => article.category === "سياسة")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <TrendingUp className="ml-2 text-news-accent" />
          السياسة
        </h1>
        <p className="text-gray-600">
          آخر التطورات السياسية المحلية والعالمية من مصادر موثوقة
        </p>
      </div>
      <ArticleGrid articles={politicsArticles} title="أخبار السياسة" />
    </div>
  );
};

export default Politics;
