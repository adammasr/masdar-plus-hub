
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";

const Economy = () => {
  const { articles } = useArticles();
  
  const economyArticles = articles
    .filter(article => article.category === "اقتصاد")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">الاقتصاد</h1>
      <ArticleGrid articles={economyArticles} title="أخبار الاقتصاد" />
    </div>
  );
};

export default Economy;
