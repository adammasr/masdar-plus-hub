
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";

const Videos = () => {
  const { articles } = useArticles();
  
  const videoArticles = articles
    .filter(article => article.videoUrl)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">فيديوهات</h1>
      <ArticleGrid articles={videoArticles} title="أحدث الفيديوهات" />
    </div>
  );
};

export default Videos;
