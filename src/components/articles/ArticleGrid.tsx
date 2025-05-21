
import { Article } from "../../context/ArticleContext";
import ArticleCard from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  title: string;
}

const ArticleGrid = ({ articles, title }: ArticleGridProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-news-accent">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleGrid;
