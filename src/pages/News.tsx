
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";

const News = () => {
  const { articles } = useArticles();
  
  const newsArticles = articles
    .filter(article => article.category === "أخبار")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">الأخبار</h1>
      <ArticleGrid articles={newsArticles} title="أحدث الأخبار" />
    </div>
  );
};

export default News;
