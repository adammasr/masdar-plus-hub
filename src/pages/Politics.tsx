
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";

const Politics = () => {
  const { articles } = useArticles();
  
  const politicsArticles = articles
    .filter(article => article.category === "سياسة")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">السياسة</h1>
      <ArticleGrid articles={politicsArticles} title="أخبار السياسة" />
    </div>
  );
};

export default Politics;
