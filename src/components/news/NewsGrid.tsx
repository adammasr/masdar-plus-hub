
import { Article } from "../../context/ArticleContext";
import ArticleCard from "../articles/ArticleCard";

interface NewsGridProps {
  articles: Article[];
}

const NewsGrid = ({ articles }: NewsGridProps) => {
  if (articles.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-gray-400 text-lg">
        لا توجد أخبار مطابقة للبحث أو الفلترة.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {articles.map(article => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          detailUrl={`/news/${article.id}`}
        />
      ))}
    </div>
  );
};

export default NewsGrid;
